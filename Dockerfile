FROM node:18.12

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5050

CMD [ "node", "app.js"]