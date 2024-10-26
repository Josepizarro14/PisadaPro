FROM node:18

WORKDIR /app

COPY app/package.json app/package-lock.json ./

COPY . .

RUN npm install

# Habilitar polling para cambios en archivos
ENV WATCHPACK_POLLING=true

# Exponer el puerto y arrancar la aplicación
EXPOSE 3000
CMD ["npm", "run", "start-watch"]
