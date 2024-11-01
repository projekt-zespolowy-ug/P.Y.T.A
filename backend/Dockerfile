FROM python:3.12.7

ENV PYTHONPATH "${PYTHONPATH}:/"
ENV PORT=8000

WORKDIR /app

COPY pyproject.toml /app/
COPY poetry.lock /app/

RUN pip install poetry
RUN poetry install

COPY . .

CMD ["poetry", "run", "fastapi", "run"]
