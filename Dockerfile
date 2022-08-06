FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

EXPOSE ${PORT}

RUN npx prisma generate && npm run build

CMD npx prisma migrate dev && npx prisma generate && npm run start:dev