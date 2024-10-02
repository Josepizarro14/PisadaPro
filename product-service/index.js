// Importar las dependencias
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Crear una aplicación de Express
const app = express(); // Cambié esto para evitar duplicados

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Definir un modelo de producto
const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String, // Campo para almacenar la URL o ruta de la imagen
}));

// Rutas para manejar productos
app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post('/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
});

// Ruta raíz
app.get('/', (req, res) => {
    res.send('Bienvenido al servicio de producto');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
