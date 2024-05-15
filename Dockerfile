FROM node:20.11-alpine

WORKDIR /app

COPY . .

RUN yarn

RUN yarn build

CMD ["yarn", "start:prod"]
