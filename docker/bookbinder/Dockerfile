FROM node:18-alpine

RUN apk add --update git python3 make g++

RUN mkdir /app
WORKDIR /app
ENV HOME /app

COPY package.json .
COPY package-lock.json .
RUN npm install

ADD .storybook/* .storybook/
ADD .storybook/sb-main-helpers/* .storybook/sb-main-helpers/
COPY ./*.config.js /app/
COPY ./.babelrc.json /app/
ADD babel-custom-plugins/*  /app/babel-custom-plugins/
ADD postcss-custom-plugins/* /app/postcss-custom-plugins/

ADD assets/* assets/

COPY docker-entrypoint.sh .

ENTRYPOINT /app/docker-entrypoint.sh
EXPOSE 3000