FROM node:12-alpine

RUN mkdir -p /user/src/app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]