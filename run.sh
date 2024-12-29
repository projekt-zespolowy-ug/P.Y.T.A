#!/bin/bash

export FRONTEND_PORT=3005
export BACKEND_PORT=8000
export ADMINER_PORT=8080

docker compose up --build
