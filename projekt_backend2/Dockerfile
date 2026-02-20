FROM debian:bookworm-slim AS builder

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    clang \
    libpq-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Odin
RUN mkdir -p /opt && \
    curl -fSL --retry 5 --retry-delay 3 \
    https://github.com/odin-lang/Odin/releases/download/dev-2026-02/odin-linux-amd64-dev-2026-02.tar.gz \
    | tar -xzf - -C /opt && \
    mv /opt/odin-linux-amd64-* /opt/odin && \
    chmod +x /opt/odin/odin

ENV PATH="/opt/odin:${PATH}"

WORKDIR /build

COPY . .

RUN odin build . -out:./backend

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    libpq5 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /build/backend ./backend

RUN chmod +x ./backend && mkdir -p /app/uploads

EXPOSE 3001

CMD ["./backend"]