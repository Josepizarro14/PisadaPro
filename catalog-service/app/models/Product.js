const mongoose = require('mongoose');

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true, min: 0 }, // Asegurarse de que el precio sea un número positivo
    categoria: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 }, // Asegurarse de que el stock sea un número positivo
    imagen: { type: String },  // URL de la imagen del producto
    fechaCreacion: { type: Date, default: Date.now } // Fecha de creación, por defecto ahora
});

// Crear el modelo a partir del esquema
const Product = mongoose.model('Product', productSchema);

// Exportar el modelo
module.exports = Product;
