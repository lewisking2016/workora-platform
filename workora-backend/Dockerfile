FROM node:20-slim

WORKDIR /app

COPY package*.json ./
# Install production deps only. Use npm install for monorepo compatibility.
RUN npm install --omit=dev --ignore-scripts && npm cache clean --force

COPY . .

EXPOSE 3001

CMD ["node", "src/index.js"]
