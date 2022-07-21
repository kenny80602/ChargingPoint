FROM node:16.13.1-stretch

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY package.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

EXPOSE 9220


CMD ["npm", "run", "start"]