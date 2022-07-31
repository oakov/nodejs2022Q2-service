FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

RUN npx prisma migrate dev && npx prisma generate

EXPOSE ${PORT}

CMD  ["npm", "run", "start:dev"]