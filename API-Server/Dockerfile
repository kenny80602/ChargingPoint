FROM node:14

ENV NODE_ENV production

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json ./usr/src/app

RUN npm install

COPY . /usr/src/app

EXPOSE 3999

CMD ["npm", "run", "start"]