FROM node:18
LABEL authors="pondpiu"
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --pure-lockfile --non-interactive

copy . ./

EXPOSE 3000

CMD yarn start