FROM public.ecr.aws/lambda/python:3.11

WORKDIR /var/task

COPY requirements.txt .
RUN pip install -r requirements.txt

# Lambda が参照する全てのコードをコピー
COPY app.py .
COPY rag/ ./rag
COPY repository/ ./repository
COPY infra/ ./infra

CMD ["app.handler"]
