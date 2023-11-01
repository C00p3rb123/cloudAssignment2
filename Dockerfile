FROM node:18-alpine3.17

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY src/ ./

EXPOSE 3005

CMD [ "yarn", "start"]


