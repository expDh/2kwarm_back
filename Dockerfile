# -------- STAGE 1: BUILD --------
# Update

FROM node:20-alpine AS builder

# Устанавливаем системные зависимости для Prisma и сборки
RUN apk add --no-cache bash git python3 make g++ libc6-compat openssl

WORKDIR /app

# Копируем package.json и устанавливаем все зависимости
COPY package*.json ./
RUN npm ci

# Копируем Prisma и генерируем клиент
COPY prisma ./prisma
RUN npx prisma generate

# Копируем исходники
COPY tsconfig*.json ./
COPY src ./src

# Сборка NestJS
RUN npm run build

# -------- STAGE 2: PRODUCTION IMAGE --------
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production


# Копируем только prod зависимости
COPY package*.json ./
RUN npm ci --omit=dev

# Копируем билд и node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]
