FROM node:20
WORKDIR /app
COPY package*.json ./
COPY .env ./
RUN npm install --omit-dev
COPY . .
EXPOSE 5015
CMD ["npm", "start:docker"]
