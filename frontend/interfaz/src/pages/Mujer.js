import React, { useEffect, useState } from 'react';
import { getProductsByCategory } from '../services/api'; // Asegúrate de que la ruta a api.js sea correcta
import '../styles/catalog.css'; // Personaliza el estilo en este archivo CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap para usar el modal

const Mujer = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const productsPerPage = 9;

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
                                    <button className="btn btn-secondary">Agregar al carrito</button>
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
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedProduct.nombre}</h5>
                                <button type="button" className="close" onClick={handleClose}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <img src={selectedProduct.imagen} className="img-fluid mb-3" alt={selectedProduct.nombre} />
                                <p>{selectedProduct.descripcion}</p>
                                <p className="fw-bold">${selectedProduct.precio}</p>
                                <p className="fw-bold">Stock: {selectedProduct.stock}</p> {/* Mostrar stock en el modal */}
                                {/* Aquí puedes añadir más detalles si lo deseas */}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>Cerrar</button>
                                <button type="button" className="btn btn-primary">Agregar al carrito</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mujer;
