FROM node:20-slim

WORKDIR /app

COPY package*.json ./
# npm ci installs exactly what package-lock.json pins — deterministic builds.
RUN npm ci --omit=dev

COPY . .

EXPOSE 3001

CMD ["node", "src/index.js"]
