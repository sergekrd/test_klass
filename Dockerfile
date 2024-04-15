FROM node:20
WORKDIR /app
COPY package*.json ./
COPY .env ./
RUN npm install
COPY . .
EXPOSE 5015
CMD ["sh", "ls -a && ts-node src/server.ts"]
