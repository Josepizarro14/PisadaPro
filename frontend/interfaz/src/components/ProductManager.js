import React, { useEffect, useState } from 'react';
import {productApi} from '../services/api';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: ''
    });

    // Obtener productos al cargar el componente
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productApi.get('/products'); // Asumiendo que tienes un endpoint /products
                setProducts(response.data);
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };
        fetchProducts();
    }, []);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await productApi.post('/products', productData); // Asegúrate de que este endpoint exista
            setProducts([...products, response.data]);
            setProductData({ name: '', description: '', price: '', stock: '', image: '' }); // Reiniciar formulario
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    };

    return (
        <div>
            <h2>Administrar Productos</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Precio:</label>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Stock:</label>
                    <input
                        type="number"
                        name="stock"
                        value={productData.stock}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Imagen:</label>
                    <input
                        type="text"
                        name="image"
                        value={productData.image}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Agregar Producto</button>
            </form>
            <h3>Lista de Productos</h3>
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        {product.name} - {product.price} - {product.stock}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductManager;
