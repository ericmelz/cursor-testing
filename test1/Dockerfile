FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 9999

HEALTHCHECK CMD curl --fail http://localhost:9999/_stcore/health

ENTRYPOINT ["streamlit", "run", "app.py", "--server.port=9999", "--server.address=0.0.0.0"] 