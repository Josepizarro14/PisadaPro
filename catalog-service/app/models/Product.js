const mongoose = require('mongoose');

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true, min: 0 }, // Asegurarse de que el precio sea un número positivo
    categoria: { type: String, required: true },
    stockPorTalla: {
        type: Map,
        of: Number,
        required: true,
        default: () => {
            const initialStock = {};
            for (let i = 30; i <= 45; i++) {
                initialStock[i] = 0;  // Stock inicial para cada talla
            }
            return initialStock;
        }
    },
    imagen: { type: String },  // URL de la imagen del producto
    fechaCreacion: { type: Date, default: Date.now } // Fecha de creación, por defecto ahora
});

// Crear el modelo a partir del esquema
const Product = mongoose.model('Product', productSchema);

// Exportar el modelo
module.exports = Product;