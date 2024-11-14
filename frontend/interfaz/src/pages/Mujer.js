import React, { useEffect, useState } from 'react';
import { getProductsByCategory } from '../services/api'; // Asegúrate de que la ruta a api.js sea correcta
import '../styles/catalog.css'; // Personaliza el estilo en este archivo CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap para usar el modal
import { useCart } from '../contexts/CartContext';

const Mujer = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const productsPerPage = 9;
    const { addToCart } = useCart(); // Usa la función addToCart del contexto
    // Obtener productos de la categoría "Mujer" al cargar el componente
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProductsByCategory('Mujer');
                setProducts(data);
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };
        fetchProducts();
    }, []);

    // Calcular el índice de los productos para la paginación
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Abrir el modal con detalles del producto seleccionado
    const handleShowDetails = (product) => {
        setSelectedProduct(product);
    };

    // Cerrar el modal
    const handleClose = () => {
        setSelectedProduct(null);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Zapatillas para Mujer</h2>
            <div className="row">
                {currentProducts.map((product) => (
                    <div key={product._id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img src={product.imagen} className="card-img-top" alt={product.nombre} />
                            <div className="card-body">
                                <h5 className="card-title">{product.nombre}</h5>
                                <p className="card-text">{product.descripcion}</p>
                                <p className="card-text fw-bold">${product.precio}</p>
                                <p className="card-text">Stock: {product.stock}</p> {/* Mostrar stock */}
                                <div className="d-flex justify-content-between">
                                    <button className="btn btn-primary" onClick={() => handleShowDetails(product)}>Ver detalles</button>
                                    <button className="btn btn-secondary" onClick={() => {
                                        addToCart(product);
                                        handleClose();
                                    }}>Agregar al carrito</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Paginación */}
            <div className="pagination mt-4 d-flex justify-content-center">
                {[...Array(Math.ceil(products.length / productsPerPage)).keys()].map((number) => (
                    <button
                        key={number}
                        onClick={() => paginate(number + 1)}
                        className={`btn mx-1 ${currentPage === number + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                    >
                        {number + 1}
                    </button>
                ))}
            </div>

            {/* Modal para detalles del producto */}
            {selectedProduct && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <h3 className="modal-title text-primary">{selectedProduct.nombre}</h3>
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <img src={selectedProduct.imagen} className="img-fluid rounded shadow-sm" alt={selectedProduct.nombre} />
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-muted mt-3">{selectedProduct.descripcion}</p>
                                        <h4 className="fw-bold text-success">${selectedProduct.precio}</h4>
                                        <p className="text-secondary"><strong>Stock disponible:</strong> {selectedProduct.stock}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-outline-secondary" onClick={handleClose}>Cerrar</button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        addToCart(selectedProduct);
                                        handleClose();
                                    }}
                                >
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mujer;
