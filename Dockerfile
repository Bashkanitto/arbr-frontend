# Базовый образ
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Подготовка минимального образа для продакшн
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8000
# Используйте vite для запуска приложения
CMD ["npm", "run", "preview"]