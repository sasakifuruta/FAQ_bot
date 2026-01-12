# rag/index_init.py
from rag.index import create_index_if_not_exists
from rag.opensearch_client import get_opensearch_client


def init_index():
    """
    OpenSearchのインデックスを初期化する。
    
    OpenSearchクライアントを取得し、インデックスが存在しない場合は
    作成する。
    """
    client = get_opensearch_client()
    create_index_if_not_exists(client)
