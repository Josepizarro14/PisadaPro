const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Asegúrate de importar cors
const productRoutes = require('./productRoutes'); // Asegúrate de que la ruta es correcta

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5000' // Cambia por el puerto donde está corriendo Flask
}));
app.use(express.json()); // Para analizar cuerpos JSON
app.use('/products', productRoutes); // Montar las rutas de productos

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

module.exports = app;
