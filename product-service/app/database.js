// product-service/app/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión a MongoDB exitosa');
    } catch (error) {
        console.error('Error de conexión a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
