# rag/index_init.py
from rag.index import get_client, create_index_if_not_exists

def init_index():
    client = get_client()
    create_index_if_not_exists(client)
