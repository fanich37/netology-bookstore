FROM node:14.16.0-alpine3.13

WORKDIR /var/www/bookstore

COPY ./package.json $WORKDIR

RUN npm install

WORKDIR src

COPY ./src $WORKDIR

CMD [ "npm", "start" ]
