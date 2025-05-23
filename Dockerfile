# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar arquivos do projeto
COPY . .

# Gerar Prisma Client (deve ser antes do build)
RUN npx prisma generate

# Compilar TypeScript (só depois do generate)
RUN npm run build

# Etapa 2: Execução
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env .env
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3333

CMD ["node", "dist/index.js"]
