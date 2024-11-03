const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const amqp = require('amqplib/callback_api'); // RabbitMQ

const app = express();
const port = process.env.PORT || 5001;
const RABBITMQ_URL = process.env.RABBITMQ_URL; // URL de RabbitMQ

// Configuración de CORS
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Conectar a RabbitMQ con reconexión
let channel = null;

function connectToRabbitMQ() {
    amqp.connect(RABBITMQ_URL, (error0, connection) => {
        if (error0) {
            console.error('Error de conexión a RabbitMQ:', error0.message);
            // Reintentar la conexión después de 5 segundos
            setTimeout(connectToRabbitMQ, 5000);
            return;
        }
        connection.createChannel((error1, ch) => {
            if (error1) {
                console.error('Error al crear canal en RabbitMQ:', error1.message);
                // Reintentar la conexión después de 5 segundos
                setTimeout(connectToRabbitMQ, 5000);
                return;
            }
            channel = ch;
            console.log('Conectado a RabbitMQ');
        });
    });
}

// Llamar a la función para intentar conectarse a RabbitMQ
connectToRabbitMQ();

// Función para enviar mensajes a la cola
function sendMessageToQueue(queue, message) {
    if (channel) {
        channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`Mensaje enviado a ${queue}:`, message);
    } else {
        console.error('No se pudo enviar el mensaje, canal no disponible');
    }
}

// Definir el modelo de producto
const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true, min: 0 },
    categoria: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    imagen: { type: String },
    fechaCreacion: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Rutas CRUD

// Crear un producto
app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        
        // Enviar mensaje a RabbitMQ
        sendMessageToQueue('product_updates', { action: 'create', data: product });
        
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
        
        // Enviar mensaje de actualización a RabbitMQ
        sendMessageToQueue('product_updates', { action: 'update', data: product });
        
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
        
        // Enviar mensaje de eliminación a RabbitMQ
        sendMessageToQueue('product_updates', { action: 'delete', data: { _id: product._id } });
        
        res.send({ message: 'Producto eliminado', product });
    } catch (error) {
        res.status(500).send({ error: 'Error al eliminar el producto: ' + error.message });
    }
});

// Endpoint de prueba de conexión
app.get('/ping', (req, res) => {
    res.send('pongaaa');
});

module.exports = app; // Añadir esta línea
