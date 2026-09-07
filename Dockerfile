FROM python:3.14-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY api ./api

COPY models ./models

WORKDIR /app/api

EXPOSE 8000

CMD ["uvicorn", "Crime_api:app", "--host", "0.0.0.0", "--port", "8000"]