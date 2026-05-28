FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

FROM base AS development

EXPOSE 3000

CMD ["node", "server.js"]
