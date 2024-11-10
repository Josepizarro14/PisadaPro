# Dockerfile para el microservicio de productos
FROM node:18

# Crear y establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY app/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Comando para ejecutar el servidor con nodemon
CMD ["npx", "nodemon", "--legacy-watch", "server.js"]
