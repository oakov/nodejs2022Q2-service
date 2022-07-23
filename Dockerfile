FROM node:16-alpine

COPY package.json ./

RUN npm install && npm cache clean --force

COPY . .

EXPOSE ${PORT}

CMD  ["npm", "run", "start:dev"]