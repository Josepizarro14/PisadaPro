FROM node:18

WORKDIR /app

COPY app/package.json app/package-lock.json ./


COPY . .

RUN npm install

CMD ["node", "app/app.js"]
