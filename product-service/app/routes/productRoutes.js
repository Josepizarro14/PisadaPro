// product-service/app/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const producto = new Product(req.body);
        await producto.save();
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el producto', error });
    }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await Product.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id);
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
    try {
        const productoActualizado = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (productoActualizado) {
            res.json(productoActualizado);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el producto', error });
    }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
    try {
        const productoEliminado = await Product.findByIdAndDelete(req.params.id);
        if (productoEliminado) {
            res.json({ message: 'Producto eliminado' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
});

module.exports = router;
