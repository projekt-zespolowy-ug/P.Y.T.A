#!/bin/bash

export FRONTEND_PORT=3000
export BACKEND_PORT=8000
export ADMINER_PORT=8080
export NEXT_PUBLIC_API_URL="http://localhost:8000/api"
docker compose up --build "$@"
