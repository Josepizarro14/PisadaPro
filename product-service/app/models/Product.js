// product-service/app/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
    stock: { type: Number, required: true },
    imagen: { type: String },  // URL de la imagen del producto
    fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
