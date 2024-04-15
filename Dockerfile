FROM node:20
WORKDIR /app
COPY package*.json ./
COPY .env ./
RUN npm install
RUN tsc
RUN npm prune --prod
COPY . .
EXPOSE 5015
CMD ["sh", "ls -a && node dist/server"]
