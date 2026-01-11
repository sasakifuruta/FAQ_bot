FROM public.ecr.aws/lambda/python:3.11

WORKDIR /var/task
COPY requirements.txt .

# pip upgrade + numpy 固定バージョン
RUN pip install --upgrade pip
RUN pip install "numpy<2"  # numpy 1.x 系のビルド済みホイールを使う
RUN pip install -r requirements.txt

COPY app.py .
COPY app.py .
COPY rag/ ./rag
COPY repository/ ./repository
COPY infra/ ./infra

CMD ["app.handler"]