const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Asegúrate de que la ruta sea correcta

// Controlador de productos
const productController = require('../controllers/productController'); // Asegúrate de tener el controlador correcto

// Ruta para procesar la creación de productos
router.post('/create_product', async (req, res) => {
    try {
        const { name, description, price, category, stock, image_url } = req.body;

        // Crear el nuevo producto con los datos recibidos
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stock,
            image_url
        });

        // Guardar el producto en la base de datos
        await newProduct.save();

        // Redirigir al panel de control de inventario después de crear el producto
        res.redirect('/inventory_control'); // Esto redirige a la página de control de inventario
    } catch (error) {
        // En caso de error, enviar un mensaje de error
        res.status(500).send('Error al crear el producto');
    }
});

// Ruta para obtener todos los productos
router.get('/', productController.getAllProducts);

// Ruta para obtener un producto por ID
router.get('/:id', productController.getProductById);

// Ruta para actualizar un producto
router.put('/:id', productController.updateProduct);

// Ruta para eliminar un producto
router.delete('/:id', productController.deleteProduct);

module.exports = router;
