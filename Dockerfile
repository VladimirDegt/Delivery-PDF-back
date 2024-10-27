FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm install

COPY ./src .

EXPOSE 8000

CMD ["npm", "start"]