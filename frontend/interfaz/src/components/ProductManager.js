import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../services/api';
import '../styles/stylesProduct.css';

const ProductManager = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [productData, setProductData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: '',
        stockPorTalla: Object.fromEntries(Array.from({length: 16},(_,i) => [30 + i, 0])),
        imagen: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(4);  // Número de productos por página
    const [showStockModal, setShowStockModal] = useState(false);
    const [selectedProductStock, setSelectedProductStock] = useState({});
    // Verificar autenticación y rol de usuario
    // Mostrar el stock por talla en el modal
    const handleViewStock = (product) => {
        setSelectedProductStock(product.stockPorTalla || {});
        setShowStockModal(true); // Mostrar el modal
    };

    // Cerrar el modal de stock
    const closeStockModal = () => {
        setShowStockModal(false);
        setSelectedProductStock({});
    };
    
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
                alert('No se pudieron cargar los productos. Intenta nuevamente más tarde.');
            }
        };

        fetchProducts();
    }, [navigate]);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };
    
    // Manejar la selección de tallas en el formulario
    const handleTallaStockChange = (talla, isChecked) => {
        setProductData((prevData) => ({
            ...prevData,
            stockPorTalla: {
                ...prevData.stockPorTalla,
                [talla]: isChecked ? prevData.stockPorTalla[talla] || 0 : 0
            }
        }));
    };

    // Manejar el cambio en el stock de cada talla seleccionada
    const handleStockChange = (talla, value) => {
        setProductData((prevData) => ({
            ...prevData,
            stockPorTalla: {
                ...prevData.stockPorTalla,
                [talla]: Number(value)
            }
        }));
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const hasValidStock = Object.values(productData.stockPorTalla).some(stock => stock > 0);
    
        if (productData.precio <= 0) {
            alert('El precio debe ser mayor a 0.');
            return;
        }
    
        if (!hasValidStock) {
            alert('Debe asignar stock a al menos una talla.');
            return;
        }
    
        try {
            if (isEditing) {
                await productApi.put(`/products/${currentProductId}`, productData);
                setProducts(products.map(product => (product._id === currentProductId ? { ...product, ...productData } : product)));
            } else {
                const response = await productApi.post('/products', productData);
                setProducts([...products, response.data]);
            }
            resetForm();
        } catch (error) {
            console.error('Error al guardar producto:', error);
            alert('Hubo un problema al guardar el producto. Intenta nuevamente.');
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
        setProductData({
            nombre: '',
            descripcion: '',
            precio: '',
            categoria: '',
            stockPorTalla: Object.fromEntries(Array.from({ length: 16 }, (_, i) => [30 + i, 0])),
            imagen: ''
        });
        setIsEditing(false);
        setCurrentProductId(null);
    };
    

    // Paginación: Obtener los productos actuales según la página
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // Cambiar página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Páginas para la paginación
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Administrar Productos</h2>
            <div className="row">
                {/* Sección para agregar/editar productos */}
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h3 className="card-title">{isEditing ? 'Modificar Producto' : 'Agregar Producto'}</h3>
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
                                    <select
                                        name="categoria"
                                        value={productData.categoria}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        <option value="Hombre">Hombre</option>
                                        <option value="Mujer">Mujer</option>
                                        <option value="Niño">Niño</option>
                                    </select>
                                </div>
                                {/* Stock por Talla */}
                                <div className="mb-3">
                                    <label className="form-label">Stock por Talla:</label>
                                    <div className="row">
                                        {[...Array(16)].map((_, i) => {
                                            const talla = 30 + i;
                                            return (
                                                <div key={talla} className="col-3 mb-2">
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name={`talla-${talla}`}
                                                            checked={!!productData.stockPorTalla[talla]}
                                                            onChange={(e) => handleTallaStockChange(talla, e.target.checked)}
                                                        />
                                                        {` Talla ${talla}`}
                                                    </label>
                                                    {productData.stockPorTalla[talla] !== undefined && (
                                                        <input
                                                            type="number"
                                                            placeholder="Stock"
                                                            min="0"
                                                            className="form-control mt-1"
                                                            value={productData.stockPorTalla[talla]}
                                                            onChange={(e) => handleStockChange(talla, e.target.value)}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
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
                                            <img
                                                src={productData.imagen}
                                                alt="Vista previa"
                                                className="img-fluid"
                                                style={{ width: '100px', height: 'auto' }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <button type="submit" className="btn btn-primary w-100 mb-2">
                                    {isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
                                </button>
                                <button type="button" onClick={resetForm} className="btn btn-secondary w-100">
                                    Cancelar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sección para listar productos */}
                <div className="col-md-6">
                    <h3 className="mt-4 text-center">Lista de Productos</h3>
                    <div className="list-group">
                        {currentProducts.map((product) => (
                            <div key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={product.imagen}
                                        alt="Vista previa"
                                        className="img-fluid"
                                        style={{ width: '60px', height: 'auto', marginRight: '10px' }}
                                    />
                                    <div>
                                        <strong>{product.nombre}</strong>
                                        <p className="mb-1 text-muted">{product.categoria}</p>
                                        <p className="mb-1">Precio: ${product.precio}</p>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="btn btn-warning btn-sm me-2"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        onClick={() => handleViewStock(product)}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        Ver stock
                                        </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Modal para mostrar el stock por talla */}
                    {showStockModal && (
                                    <div className="modal-overlay">
                                        <div className="modal-content">
                                            <ul className="list-group mt-3">
                                                {Object.entries(selectedProductStock).map(([talla, cantidad]) => (
                                                    <li key={talla} className="list-group-item">
                                                        <strong>Talla {talla}:</strong> {cantidad} existencias
                                                    </li>
                                                ))}
                                            </ul>
                                            <button onClick={closeStockModal} className="btn btn-secondary mt-3">
                                                Cerrar
                                            </button>
                                        </div>
                                    </div>
                                )}
                    {/* Paginación */}
                    <div className="d-flex justify-content-center mt-3">
                        <nav>
                            <ul className="pagination">
                                {pageNumbers.map(number => (
                                    <li key={number} className="page-item">
                                        <button
                                            onClick={() => paginate(number)}
                                            className="page-link"
                                        >
                                            {number}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductManager;
