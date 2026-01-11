FROM public.ecr.aws/lambda/python:3.10

WORKDIR /var/task

COPY requirements.txt .

# pip install
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY app.py .
COPY rag/ ./rag
COPY repository/ ./repository
COPY infra/ ./infra

CMD ["app.handler"]
