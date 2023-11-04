FROM node:18

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --pure-lockfile --non-interactive

copy . ./

EXPOSE 4000

CMD [ "yarn", "start"]


