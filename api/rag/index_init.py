# rag/index_init.py
from rag.index import create_index_if_not_exists
from rag.opensearch_client import get_opensearch_client


def init_index():
    client = get_opensearch_client()
    create_index_if_not_exists(client)
