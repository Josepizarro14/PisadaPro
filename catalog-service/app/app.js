const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const amqp = require('amqplib/callback_api'); // RabbitMQ
const Product = require('./models/Product'); // Modelo de producto

const app = express();
const port = process.env.PORT || 5002; // Definir el puerto
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

// Conectar a RabbitMQ y configurar el consumidor
let channel = null;

function connectRabbitMQ() {
    amqp.connect(RABBITMQ_URL, (error0, connection) => {
        if (error0) {
            console.error('Error al conectar a RabbitMQ:', error0);
            setTimeout(connectRabbitMQ, 5000); // Reintentar conexión
            return;
        }
        connection.createChannel((error1, ch) => {
            if (error1) {
                console.error('Error al crear el canal de RabbitMQ:', error1);
                setTimeout(connectRabbitMQ, 5000); // Reintentar conexión
                return;
            }
            channel = ch;
            console.log('Conectado a RabbitMQ');

            const queue = 'product_updates';
            
            channel.assertQueue(queue, { durable: false });
            console.log(`Esperando mensajes en ${queue}`);

            channel.consume(queue, async (msg) => {
                const message = JSON.parse(msg.content.toString());
                console.log(`Mensaje recibido:`, message);
                
                // Manejar el mensaje según la acción
                try {
                    switch (message.action) {
                        case 'create':
                            await Product.create(message.data);
                            console.log('Producto creado:', message.data);
                            break;

                        case 'update':
                            await Product.findByIdAndUpdate(message.data._id, message.data, { new: true });
                            console.log('Producto actualizado:', message.data);
                            break;

                        case 'delete':
                            await Product.findByIdAndDelete(message.data._id);
                            console.log('Producto eliminado:', message.data._id);
                            break;

                        default:
                            console.error('Acción desconocida:', message.action);
                            break;
                    }
                } catch (error) {
                    console.error('Error al procesar el mensaje:', error);
                }
            }, { noAck: true });
        });
    });
}

// Iniciar la conexión a RabbitMQ
connectRabbitMQ();

// Endpoint para obtener todos los productos (opcional)
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener productos: ' + error.message });
    }
});

// Endpoint de prueba de conexión
app.get('/ping', (req, res) => {
    res.send('pong');
});


module.exports = app; // Añadir esta línea
