# Базовый образ
FROM node:18-alpine AS builder

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm install

# Копирование и сборка
COPY . .
RUN npm run build

# Подготовка минимального образа для продакшн
FROM node:18-alpine AS runner

WORKDIR /app

# Копирование собранных файлов
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env .env
COPY .env /app/.env

EXPOSE 8000
CMD ["npm", "run", "preview"]
