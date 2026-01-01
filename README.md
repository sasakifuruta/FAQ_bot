# FAQ Bot

社内向け RAG（Retrieval-Augmented Generation）FAQ システムのサンプル実装です。  
DynamoDB にナレッジを保存し、OpenSearch のベクトル検索で関連資料を取得して、LLM で回答を生成します。

---

## 技術スタック

- **Backend**: FastAPI
- **Frontend**: Remix
- **Database**: DynamoDB (ローカル)
- **Search**: OpenSearch (ローカル、ベクトル検索対応)
- **Embedding / LLM**: Python モジュールで実装
- **Docker**: docker-compose で全サービス起動可能

---

## 起動方法

```bash
# コンテナビルド & 起動
docker compose build --no-cache
docker compose up -d

# API コンテナに入って初回データ投入（任意）
docker compose exec api python -m rag.index
