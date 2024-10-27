# Используем минимальный базовый образ Node.js
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json для кэширования зависимостей
COPY package*.json ./

# Устанавливаем только необходимые зависимости
RUN npm install

# Копируем остальные файлы
COPY . .

# Сборка приложения
RUN npm run build

# Создаем минимальный образ для продакшн
FROM node:18-alpine AS runner

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY --from=builder /app/package*.json ./

# Устанавливаем только продакшн зависимости
RUN npm ci --only=production

# Копируем только необходимые папки и файлы из builder stage
COPY --from=builder /app/.dist ./.dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env .env

# Указываем порт, который будет использоваться приложением
EXPOSE 8000

# Команда для запуска приложения
CMD ["npm", "run", "preview"]
