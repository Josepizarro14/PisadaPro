import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../services/api';
import '../styles/catalog.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/stylesProduct.css';
import { useCart } from '../contexts/CartContext';

const Todos = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToCart } = useCart();
    const [selectedTalla, setSelectedTalla] = useState(null); // Talla seleccionada
    const productsPerPage = 9;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };
        fetchProducts();
    }, []);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleShowDetails = (product) => {
        setSelectedProduct(product);
    };

    const handleClose = () => {
        setSelectedProduct(null);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Todos los Productos</h2>
            <div className="row">
                {currentProducts.map((product) => (
                    <div key={product._id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img src={product.imagen} className="card-img-top" alt={product.nombre} />
                            <div className="card-body text-center">
                                <h5 className="card-title">{product.nombre}</h5>
                                <p className="card-text">{product.descripcion}</p>
                                <p className="card-text fw-bold">${product.precio}</p>
                                <button className="btn btn-dark btn-sm mt-2" onClick={() => handleShowDetails(product)}>
                                    Ver detalles
                                </button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

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
                <div
                    className="modal fade show d-flex justify-content-center align-items-center"
                    style={{
                        display: 'block',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        minHeight: '100vh',
                        transition: 'background-color 0.3s ease', // Suaviza el fondo
                    }}
                    tabIndex="-1"
                    role="dialog"
                >
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content shadow-lg rounded-3" style={{ borderRadius: '1.5rem' }}>
                            <div className="modal-header border-0 pb-4">
                                <h3 className="modal-title text-primary fs-2">{selectedProduct.nombre}</h3>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    aria-label="Close"
                                    onClick={handleClose}
                                ></button>
                            </div>
                            <div className="modal-body d-flex flex-column flex-md-row">
                                <div className="col-md-6 mb-4 mb-md-0">
                                    <img
                                        src={selectedProduct.imagen}
                                        className="img-fluid rounded-3 shadow-lg"
                                        alt={selectedProduct.nombre}
                                    />
                                </div>
                                <div className="col-md-6 d-flex flex-column justify-content-between">
                                    <p className="text-muted mt-3">{selectedProduct.descripcion}</p>
                                    <h4 className="fw-bold text-success fs-3">${selectedProduct.precio}</h4>
                                    <p className="text-secondary mt-4">
                                        <strong>Stock por talla:</strong>
                                    </p>
                                    <div className="d-flex flex-wrap mt-2">
                                        {Object.entries(selectedProduct.stockPorTalla)
                                            .filter(([_, stock]) => stock > 0) // Excluir tallas con stock = 0
                                            .map(([talla, stock]) => (
                                                <button
                                                    key={talla}
                                                    className={`btn btn-outline-primary btn-sm m-1 px-4 py-2 ${talla === selectedTalla ? 'active' : ''}`}
                                                    onClick={() => setSelectedTalla(talla)}
                                                >
                                                    {talla} ({stock})
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-4">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary px-4 py-2"
                                    onClick={handleClose}
                                >
                                    Cerrar
                                </button>
                                <button
                                    className="btn btn-primary px-4 py-2"
                                    disabled={!selectedTalla}
                                    onClick={() => {
                                        addToCart({ ...selectedProduct, talla: selectedTalla });
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

export default Todos;
