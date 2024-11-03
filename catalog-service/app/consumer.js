const amqp = require('amqplib/callback_api');
const mongoose = require('mongoose');
const Product = require('./models/Product.js'); // Asegúrate de tener tu modelo aquí


const RABBITMQ_URL = process.env.RABBITMQ_URL;

// Conectar a RabbitMQ
amqp.connect(RABBITMQ_URL, (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }
        
        const queue = 'product_updates';
        
        channel.assertQueue(queue, { durable: false });
        console.log(`Esperando mensajes en ${queue}`);

        channel.consume(queue, async (msg) => {
            const message = JSON.parse(msg.content.toString());
            console.log(`Mensaje recibido:`, message);
            
            // Manejar el mensaje según la acción
            switch (message.action) {
                case 'create':
                    // Lógica para manejar creación de producto
                    await Product.create(message.data);
                    console.log('Producto creado:', message.data);
                    break;

                case 'update':
                    // Lógica para manejar actualización de producto
                    await Product.findByIdAndUpdate(message.data._id, message.data, { new: true });
                    console.log('Producto actualizado:', message.data);
                    break;

                case 'delete':
                    // Lógica para manejar eliminación de producto
                    await Product.findByIdAndDelete(message.data._id);
                    console.log('Producto eliminado:', message.data._id);
                    break;

                default:
                    console.error('Acción desconocida:', message.action);
                    break;
            }
        }, { noAck: true });
    });
});
