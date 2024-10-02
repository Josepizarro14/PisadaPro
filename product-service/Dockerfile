# Usa la imagen base de Node
FROM node:18

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias (esto incluirá nodemon)
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto que usará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]
