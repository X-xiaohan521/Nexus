FROM ghcr.io/astral-sh/uv:debian AS builder

WORKDIR /build
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Install dependencies (cached layer)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Copy application source
COPY src ./src

FROM python:3.12 AS runtime

ENV LANG="C.UTF-8" \
    TZ=Asia/Shanghai \
    PUID=1000 \
    PGID=1000 \
    UMASK=022

WORKDIR /app

# Copy venv and source from builder
COPY --from=builder /build/.venv /app/.venv
COPY --from=builder /build/src .

ENV PATH="/app/.venv/bin:$PATH"

CMD ["python", "./main/main.py"]
