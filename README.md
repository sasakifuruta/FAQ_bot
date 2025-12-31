# FAQ_bot

## メモ

1. 仮想環境内でFAISSインデックスを作成
❯ python3 -m venv .venv 
❯ source .venv/bin/activate
❯ PYTHONPATH=. python experiment/build_index.py
-> 出力例：index created, vectors.shape: (3, 1536) dim: 1536

2. Dockerコンテナ起動
❯ docker build -t faq-bot . 
❯ docker run --env-file .env -p 8000:8000 faq-bot 