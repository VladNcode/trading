FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && \
    npm prune --production

COPY . .

CMD ["node", "--env-file=.env", "src/index.js"]