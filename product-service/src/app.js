const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./productRoutes');

const app = express();
app.use(express.json()); // Para analizar cuerpos JSON
app.use('/products', productRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

module.exports = app;
