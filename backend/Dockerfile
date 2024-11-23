FROM python:3.12.7-slim AS base

ENV PORT=8000

# Install necessary dependencies
RUN apt-get update && apt-get install -y curl

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python3 - && \
    ln -s /opt/poetry/bin/poetry /usr/local/bin/poetry

WORKDIR /app

COPY pyproject.toml poetry.lock /app/

# Install dependencies using Poetry
RUN poetry install --no-root

COPY . .

# Running tests
FROM base AS test

ARG SKIP_TESTS=false
RUN if [ "$SKIP_TESTS" = "false" ]; then poetry run pytest; fi

# Remove tests
FROM base AS prod

RUN rm -rf  /tests

WORKDIR /app
EXPOSE ${PORT}

CMD ["poetry", "run", "fastapi", "run"]
