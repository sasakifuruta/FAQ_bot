# rag/bootstrap.py
from rag.opensearch_client import get_opensearch_client
from rag.index import create_index_if_not_exists, bulk_index_chunks
from repository.docs import list_doc_ids

INDEX_NAME = "docs_chunks"

def bootstrap_opensearch(force: bool = False):
    """
    OpenSearchのインデックスを初期化し、DynamoDBからデータを同期する。
    
    インデックスが存在しない場合は作成し、既にデータが存在する場合は
    forceパラメータがTrueでない限りスキップする。
    
    Args:
        force (bool, optional): Trueの場合、既存データがあっても再同期を実行する。
                                デフォルトはFalse。
    """
    client = get_opensearch_client()

    # 1. インデックスは必ず存在させる
    create_index_if_not_exists(client)

    # 2. すでにデータがあるならスキップ（暫定仕様）
    count = client.count(index=INDEX_NAME)["count"]
    if count > 0 and not force:
        print("OpenSearch already has data. skip bootstrap.")
        return

    print("bootstrap start")

    # 3. DynamoDB → OpenSearch 同期
    for doc_id in list_doc_ids():
        print(f"indexing doc_id={doc_id}")
        bulk_index_chunks(client, doc_id)

    print("bootstrap done")
