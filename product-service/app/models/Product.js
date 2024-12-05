// product-service/app/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
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
        }},
    imagen: { type: String },  // URL de la imagen del producto
    fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);