FROM node:18-alpine

RUN addgroup -S sevchaingroup && adduser -S sevchainuser -G sevchaingroup
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3030

USER sevchainuser

CMD [ "npm", "start" ]