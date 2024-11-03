import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../services/api';

const ProductManager = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [productData, setProductData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: '',
        stock: '',
        imagen: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    // Verificar autenticación y rol de usuario
    useEffect(() => {
        const role = localStorage.getItem('userRole');
        const isAuthenticated = localStorage.getItem('isAuthenticated');

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (role !== 'administrador') {
            alert('No tienes permiso para acceder a esta página.');
            navigate('/');
            return;
        }

        const fetchProducts = async () => {
            try {
                const response = await productApi.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };

        fetchProducts();
    }, [navigate]);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Actualizar producto
                await productApi.put(`/products/${currentProductId}`, productData);
                setProducts(products.map(product => (product._id === currentProductId ? productData : product)));
            } else {
                // Crear producto
                const response = await productApi.post('/products', productData);
                setProducts([...products, response.data]);
            }
            resetForm();
        } catch (error) {
            console.error('Error al guardar producto:', error);
        }
    };

    // Manejar la edición de un producto
    const handleEdit = (product) => {
        setProductData(product);
        setIsEditing(true);
        setCurrentProductId(product._id);
    };

    // Manejar la eliminación de un producto
    const handleDelete = async (id) => {
        try {
            await productApi.delete(`/products/${id}`);
            setProducts(products.filter(product => product._id !== id));
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    // Reiniciar el formulario
    const resetForm = () => {
        setProductData({ nombre: '', descripcion: '', precio: '', categoria: '', stock: '', imagen: '' });
        setIsEditing(false);
        setCurrentProductId(null);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mt-4">Administrar Productos</h2>
            <div className="row">
                {/* Sección para agregar/editar productos */}
                <div className="col-md-6">
                    <h3>{isEditing ? 'Modificar Producto' : 'Agregar Producto'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nombre:</label>
                            <input
                                type="text"
                                name="nombre"
                                value={productData.nombre}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Descripción:</label>
                            <textarea
                                name="descripcion"
                                value={productData.descripcion}
                                onChange={handleChange}
                                required
                                className="form-control"
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Precio:</label>
                            <input
                                type="number"
                                name="precio"
                                value={productData.precio}
                                onChange={handleChange}
                                required
                                min="0"
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Categoría:</label>
                            <input
                                type="text"
                                name="categoria"
                                value={productData.categoria}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Stock:</label>
                            <input
                                type="number"
                                name="stock"
                                value={productData.stock}
                                onChange={handleChange}
                                required
                                min="0"
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Imagen:</label>
                            <input
                                type="text"
                                name="imagen"
                                value={productData.imagen}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                            {productData.imagen && (
                                <div className="mt-2">
                                    <img src={productData.imagen} alt="Vista previa" style={{ width: '100px', height: 'auto' }} />
                                </div>
                            )}
                        </div>
                        <button type="submit" className="btn btn-primary">{isEditing ? 'Actualizar Producto' : 'Agregar Producto'}</button>
                        <button type="button" onClick={resetForm} className="btn btn-secondary ms-2">Cancelar</button>
                    </form>
                </div>

                {/* Sección para listar productos */}
                <div className="col-md-6">
                    <h3 className="mt-4">Lista de Productos</h3>
                    <ul className="list-group">
                        {products.map((product) => (
                            <li key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{product.nombre}</strong> - ${product.precio} - Stock: {product.stock} - Categoría: {product.categoria}
                                    {product.imagen && (
                                        <img src={product.imagen} alt="Vista previa" style={{ width: '50px', height: 'auto', marginLeft: '10px' }} />
                                    )}
                                </div>
                                <div>
                                    <button onClick={() => handleEdit(product)} className="btn btn-warning btn-sm me-2">Editar</button>
                                    <button onClick={() => handleDelete(product._id)} className="btn btn-danger btn-sm">Eliminar</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProductManager;
