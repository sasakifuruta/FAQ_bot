# app.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from mangum import Mangum
from rag.qa import ask_question
from rag.bootstrap import bootstrap_opensearch
from fastapi.responses import JSONResponse


app = FastAPI()


origins = [
    "http://localhost:5173",# Remix dev サーバー
    "http://faq-chatbot-frontend0110.s3-website-ap-northeast-1.amazonaws.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    question: str
    top_k: int = 5


@app.on_event("startup")
def on_startup():
    """
    FastAPIアプリケーション起動時に実行される関数。
    
    OpenSearchのインデックスを初期化する。エラーが発生した場合でも
    アプリケーションの起動は継続する（警告のみ出力）。
    """
    try:
        bootstrap_opensearch()
    except Exception as e:
        print(f"[WARN] index init failed: {e}")


@app.post("/api/ask")
def ask(req: AskRequest):
    """
    質問に対する回答を生成するAPIエンドポイント。
    
    Args:
        req (AskRequest): 質問内容とtop_kパラメータを含むリクエスト
        
    Returns:
        JSONResponse: 回答と関連するソース情報を含むJSONレスポンス
    """
    result = ask_question(
        question=req.question,
        top_k=req.top_k,
    )
    return JSONResponse(
        content=result,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    )


# =====================
# Lambda用入り口
# =====================


@app.get("/")
def root():
    """
    ヘルスチェック用のルートエンドポイント。
    
    Returns:
        dict: {"ok": True} を含む辞書
    """
    return {"ok": True}

# Lambda用ハンドラ（デプロイ用）
handler = Mangum(app, lifespan="off")

# ローカル開発用：uvicornで立ち上げてブラウザやcurlで確認
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)