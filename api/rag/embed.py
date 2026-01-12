# rag/embed.py
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()

def embed_text(text: str) -> list[float]:
    """
    単一テキストをベクトルに変換する。
    
    OpenAIのtext-embedding-3-smallモデルを使用してテキストを
    埋め込みベクトルに変換する。
    
    Args:
        text (str): ベクトル化するテキスト
        
    Returns:
        list[float]: テキストの埋め込みベクトル
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
    DynamoDBから取得したチャンク一覧に埋め込みベクトルを付与する。
    
    各チャンクの"chunk"フィールドのテキストをベクトル化し、
    "embedding"フィールドとして追加する。
    
    Args:
        chunks (list[dict]): チャンク情報のリスト。各要素には"chunk"キーが含まれる
        
    Returns:
        list[dict]: 各チャンクに"embedding"キーが追加されたリスト
    """
    for chunk in chunks:
        text = chunk["chunk"]
        vector = embed_text(text)
        chunk["embedding"] = vector

    return chunks
