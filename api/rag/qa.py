# rag/qa.py
import os
from urllib.parse import urlparse
from rag.embed import embed_text
from rag.llm import generate_answer
from opensearchpy import OpenSearch
from dotenv import load_dotenv
from rag.opensearch_client import get_opensearch_client

load_dotenv()

INDEX_NAME = "docs_chunks"


def ask_question(question: str, top_k: int = 5) -> dict:
    """
    1. 質問を embedding に変換
    2. OpenSearch で knn 検索
    3. CHUNK をまとめて prompt 作成
    4. LLM で回答生成
    5. sources 付きで返す
    """

    print("ask_question start")
    client = get_opensearch_client()
    print("OpenSearch client ready")

    # 1. embedding
    query_embedding = embed_text(question)
    print("Embedding created")

    # 2. knn 検索
    response = client.search(
        index=INDEX_NAME,
        body={
            "size": top_k,
            "query": {
                "knn": {
                    "embedding": {
                        "vector": query_embedding,
                        "k": top_k
                    }
                }
            }
        }
    )
    print("OpenSearch search done")

    # 3. CHUNK をまとめて prompt 作成
    chunks = [hit["_source"] for hit in response["hits"]["hits"]]
    
    context = "\n".join(
        f"資料{i+1}: {c['chunk']}"
        for i, c in enumerate(chunks)
    )
    
    prompt = f"""
    以下は質問に関連する参考資料です。
    資料に直接書かれていない場合でも、合理的に推測できる範囲で回答してください。
    {context}
    質問:
    {question}
    """.strip()
    

    # 4. LLM で回答生成
    answer = generate_answer(prompt)
    print("LLM answer generated")
    
    sources = [
        {
            "doc_id": hit["_source"]["doc_id"],
            "chunk_id": hit["_id"],
            "score": hit["_score"]
        }
        for hit in response["hits"]["hits"]
    ]

    # 5. sources 付きで返す
    result = {
        "answer": answer,
        "sources": sources
    }

    return result

# テスト実行用
if __name__ == "__main__":
    q = "VPN に接続できません。どうすればいいですか？"
    print(ask_question(q))
