# rag/index.py
from dotenv import load_dotenv
from opensearchpy import helpers
from repository.docs import get_doc_chunks
from rag.opensearch_client import get_opensearch_client
from rag.embed import embed_text

load_dotenv()

INDEX_NAME = "docs_chunks"


def create_index_if_not_exists(client):
    print("create_index_if_not_exists called")
    try:
        if not client.indices.exists(index=INDEX_NAME):
            print("index not exists, creating...")
            response = client.indices.create(
                index=INDEX_NAME,
                body={
                    "settings": {
                    },
                    "mappings": {
                        "properties": {
                            "doc_id": {"type": "keyword"},
                            "chunk": {"type": "text"},
                            "tags": {"type": "keyword"},
                            "embedding": {
                                "type": "dense_vector",
                                "dimension": 1536
                            }
                        }
                    }
                }
            )
            print("index creation response:", response)
        else:
            print("index already exists")
    except Exception as e:
        print("index creation failed:", e)
        raise


def bulk_index_chunks(client, doc_id: str):
    chunks = get_doc_chunks(doc_id)
    actions = []

    for chunk in chunks:
        embedding = embed_text(chunk["chunk"])
        actions.append({
            "_op_type": "index",
            "_index": INDEX_NAME,
            "_id": chunk["SK"],
            "_source": {
                "doc_id": chunk["PK"],
                "chunk": chunk["chunk"],
                "tags": chunk.get("tags", []),
                "embedding": embedding
            }
        })

    success, failed = helpers.bulk(
        client,
        actions,
        raise_on_error=False,
        stats_only=False
    )

    print(f"success: {success}, failed: {len(failed)}")
    return success, failed

# テスト実行用
if __name__ == "__main__":
    client = get_opensearch_client()
    create_index_if_not_exists(client)
    bulk_index_chunks(client, "vpn-manual")
