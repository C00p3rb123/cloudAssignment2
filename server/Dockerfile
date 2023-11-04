FROM node:18-alpine3.17

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

COPY src/ ./src
COPY tsconfig.json ./

EXPOSE 4000

CMD [ "yarn", "start"]


