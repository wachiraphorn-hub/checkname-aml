FROM python:3.12-slim AS base
WORKDIR /app
COPY . .

FROM base AS development
CMD ["python", "app.py"]
