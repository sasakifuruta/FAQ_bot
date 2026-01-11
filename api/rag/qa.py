# rag/qa.py
import os
import numpy as np
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
    NumPy で類似度検索し、LLM で回答生成
    """
    print("ask_question start")
    client = get_opensearch_client()
    if not client.indices.exists(index=INDEX_NAME):
        create_index_if_not_exists(client)
    print("OpenSearch client ready")

    # embedding を作成
    query_emb = np.array(embed_text(question), dtype="float32")
    query_emb /= np.linalg.norm(query_emb)  # L2 正規化
    print(f"Query embedding created, dim={query_emb.shape[0]}")

    # OpenSearch から全件取得
    print("OpenSearch search start")
    resp = client.search(
        index=INDEX_NAME,
        body={
            "size": 1000,  # 必要に応じて調整
            "_source": ["doc_id", "chunk", "embedding"]
        }
    )
    print(f"OpenSearch search done: {resp}")

    chunks = []
    embeddings = []
    
    print("OpenSearch search hits start")
    print(f"OpenSearch search hits: {resp['hits']['hits']}")
    for hit in resp["hits"]["hits"]:
        chunks.append(hit["_source"])
        emb = np.array(eval(hit["_source"]["embedding"]), dtype="float32")
        emb /= np.linalg.norm(emb)  # L2 正規化
        embeddings.append(emb)
    print("OpenSearch search hits end")

    # print("embeddings start")
    # embeddings = np.stack(embeddings)
    # print(f"{len(chunks)} chunks loaded from OpenSearch")
    # print("embeddings end")

    # # cosine 類似度計算（内積で代用）
    # print("cosine similarity calculation start")
    # sims = embeddings @ query_emb  # shape=(num_chunks,)
    # top_idx = np.argsort(-sims)[:top_k]  # 類似度降順に top_k 取得
    # top_chunks = [chunks[i] for i in top_idx]
    # top_scores = sims[top_idx]
    # print(f"Top {top_k} chunks selected")
    # print("cosine similarity calculation end")
    
    print("embeddings start")
    if embeddings:
        embeddings = np.stack(embeddings)
        # cosine 類似度計算
        sims = embeddings @ query_emb
        top_idx = np.argsort(-sims)[:top_k]
        top_chunks = [chunks[i] for i in top_idx]
        top_scores = sims[top_idx]
    else:
        print("no embeddings")
        top_chunks = []
        top_scores = np.array([])
    print(f"embeddings end.  top_chunks: {top_chunks}")
    

    # context 作成
    print("context creation start")
    context = "\n".join(f"資料{i+1}: {c['chunk']}" for i, c in enumerate(top_chunks))
    print(f"context created: {context}")

    print("prompt creation start")
    prompt = f"""
    以下は質問に関連する参考資料です。
    資料に直接書かれていない場合でも、合理的に推測できる範囲で回答してください。
    {context}
    質問:
    {question}
    """.strip()
    print(f"prompt created: {prompt}")
    
    # LLM で回答生成
    print("LLM answer generation start")
    answer = generate_answer(prompt)
    print(f"LLM answer generated: {answer}")

    # sources 作成
    print("sources creation start")
    sources = [
        {"doc_id": c["doc_id"], "chunk": c["chunk"], "score": float(score)}
        for c, score in zip(top_chunks, top_scores)
    ]
    print(f"sources created: {sources}")
    print("sources creation end")
    
    print("answer returning start")
    return {"answer": answer, "sources": sources}


# テスト実行用
if __name__ == "__main__":
    q = "VPN に接続できません。どうすればいいですか？"
    print(ask_question(q))
