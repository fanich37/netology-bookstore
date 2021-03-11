FROM node:14.16.0-alpine3.13

WORKDIR /var/www/bookstore

COPY ./package.json ./package-lock.json $WORKDIR

RUN npm install

COPY ./src ./src

CMD [ "npm", "start" ]
