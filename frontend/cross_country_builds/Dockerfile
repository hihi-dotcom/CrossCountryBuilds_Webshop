FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/dist ./dist

# This container's only job is to share the dist folder via volume
CMD ["tail", "-f", "/dev/null"]