# rag/qa.py
import os
import faiss
import numpy as np
from urllib.parse import urlparse
from rag.embed import embed_text
from rag.llm import generate_answer
from opensearchpy import OpenSearch
from dotenv import load_dotenv
from rag.opensearch_client import get_opensearch_client
from rag.index import create_index_if_not_exists


load_dotenv()

INDEX_NAME = "docs_chunks"


def ask_question(question: str, top_k: int = 5) -> dict:
    """
    FAISS で類似度検索し、LLM で回答生成
    """
    print("ask_question start")
    client = get_opensearch_client()
    if not client.indices.exists(index=INDEX_NAME):
        create_index_if_not_exists(client)
    print("OpenSearch client ready")

    # FAISS で検索
    faiss_results = search_faiss(question, client, top_k=top_k)
    print(f"FAISS search done, {len(faiss_results)} chunks retrieved")

    # context 作成
    print("context creating")
    context = "\n".join(
        f"資料{i+1}: {c['chunk']}" for i, c in enumerate(faiss_results)
    )
    print(f"context created: {context}")

    print("prompt creating")
    prompt = f"""
    以下は質問に関連する参考資料です。
    資料に直接書かれていない場合でも、合理的に推測できる範囲で回答してください。
    {context}
    質問:
    {question}
    """.strip()
    print(f"prompt created: {prompt}")
    
    # LLM で回答生成
    print("LLM answer generating")
    answer = generate_answer(prompt)
    print(f"LLM answer generated: {answer}")

    # sources 作成（FAISS の結果から）
    print("sources creating")
    sources = [
        {
            "doc_id": c["doc_id"],
            "chunk": c["chunk"],  # _id は OpenSearch 上では使えないので chunk を代替
            "score": None  # FAISS は score を 0〜1 の類似度で返す場合、D[i] を入れることも可能
        }
        for c in faiss_results
    ]
    print(f"sources created: {sources}")

    print("answer returning")
    return {
        "answer": answer,
        "sources": sources
    }



def build_faiss_index(client, top_k=1000):
    """
    OpenSearch から chunk と embedding を取得して FAISS インデックスを作る
    """
    # OpenSearch 全件取得
    resp = client.search(
        index=INDEX_NAME,
        body={
            "size": top_k,
            "_source": ["doc_id", "chunk", "embedding"]
        }
    )
    chunks = []
    embeddings = []

    for hit in resp["hits"]["hits"]:
        chunks.append(hit["_source"])
        # 文字列化されている embedding を float 配列に戻す
        emb = np.array(eval(hit["_source"]["embedding"]), dtype="float32")
        embeddings.append(emb)

    embeddings = np.stack(embeddings)

    # FAISS インデックス作成（内積 / cosine）
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)
    faiss.normalize_L2(embeddings)
    index.add(embeddings)

    return index, chunks

def search_faiss(query: str, client, top_k=5):
    """
    クエリ文字列を embedding 化して FAISS で類似検索
    """
    query_emb = np.array(embed_text(query), dtype="float32").reshape(1, -1)
    faiss.normalize_L2(query_emb)

    index, chunks = build_faiss_index(client)
    D, I = index.search(query_emb, top_k)

    # 類似度の高い chunk を返す
    results = [chunks[i] for i in I[0]]
    return results



# テスト実行用
if __name__ == "__main__":
    q = "VPN に接続できません。どうすればいいですか？"
    print(ask_question(q))
