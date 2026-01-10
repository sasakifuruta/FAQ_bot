# rag/embed.py
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()

def embed_text(text: str) -> list[float]:
    """
    単一テキストを embedding ベクトルに変換する
    """
    print("embed_text called")
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    print("embedding received")
    return response.data[0].embedding


def embed_chunks(chunks: list[dict]) -> list[dict]:
    """
    DynamoDB から取得した CHUNK 一覧に embedding を付与する
    """
    for chunk in chunks:
        text = chunk["chunk"]
        vector = embed_text(text)
        chunk["embedding"] = vector

    return chunks
