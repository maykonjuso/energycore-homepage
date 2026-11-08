# Homepage da EnergyCore em um serviço: FastAPI serve o site compilado, o contato e o assistente.
FROM node:22-alpine AS web
WORKDIR /app/web
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:0.13.1 /uv /usr/local/bin/uv
WORKDIR /app/server
COPY server/pyproject.toml server/uv.lock ./
RUN uv sync --frozen --no-dev
COPY server/ ./
COPY --from=web /app/web/dist /app/web/dist
ENV SITE_DIR=/app/web/dist PORT=8000 PYTHONUNBUFFERED=1
EXPOSE 8000
CMD ["sh", "-c", "uv run --no-sync uvicorn app:app --host 0.0.0.0 --port ${PORT}"]
