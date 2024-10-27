FROM python:3.12.7

ENV PYTHONPATH "${PYTHONPATH}:/"
ENV PORT=8000

WORKDIR /app

COPY . .

RUN pip install poetry
RUN poetry install

CMD ["poetry", "run", "fastapi", "run", "app/main.py", "--port", "8000"]
