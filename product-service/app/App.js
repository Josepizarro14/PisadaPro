const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa cors

const app = express();
const port = process.env.PORT || 5001; // Definir el puerto

// Configuración de CORS
const corsOptions = {
    origin: 'http://localhost:3000', // Cambia esto al origen de tu frontend
    credentials: true // Esto permite enviar cookies junto con la solicitud
};

app.use(cors(corsOptions)); // Aplicar las opciones de CORS

// Middleware
app.use(bodyParser.json()); // Para parsear JSON

// Conectar a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Definir el modelo de producto
const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true, min: 0 }, // Precio no negativo
    categoria: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 }, // Stock no negativo
    imagen: { type: String },  // URL de la imagen del producto
    fechaCreacion: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Rutas CRUD
// Crear un producto
app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send({ error: 'Error al crear el producto: ' + error.message });
    }
});

// Obtener todos los productos
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener productos: ' + error.message });
    }
});

// Actualizar un producto
app.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).send({ error: 'Producto no encontrado' });
        }
        res.send(product);
    } catch (error) {
        res.status(400).send({ error: 'Error al actualizar el producto: ' + error.message });
    }
});

// Eliminar un producto
app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send({ error: 'Producto no encontrado' });
        }
        res.send({ message: 'Producto eliminado', product });
    } catch (error) {
        res.status(500).send({ error: 'Error al eliminar el producto: ' + error.message });
    }
});

// Endpoint de prueba de conexión
app.get('/ping', (req, res) => {
    res.send('pongaaa');
});

// Exportar la instancia de app
module.exports = app; // Añadir esta línea
