import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCart } from '../contexts/CartContext';
import '../styles/styles.css';

const catalogApi = axios.create({
    baseURL: 'http://localhost:5002', // URL del microservicio de catálogo
    withCredentials: true,
});

const Home = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToCart } = useCart(); // Usa la función addToCart del contexto

    useEffect(() => {
        const fetchRandomProducts = async () => {
            try {
                const response = await catalogApi.get('/products/random');
                setProducts(response.data);
            } catch (error) {
                console.error('Error al obtener productos aleatorios:', error);
            }
        };

        fetchRandomProducts();
    }, []);

    const handleShowDetails = (product) => {
        setSelectedProduct(product);
    };

    const handleClose = () => {
        setSelectedProduct(null);
    };

    return (
        <div>
            {/* Carrusel */}
            <div id="carouselExampleIndicators" className="carousel slide mb-4" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="/assets/images/slide1.jpg" className="d-block w-100" alt="Zapatilla 1" />
                        
                    </div>
                    <div className="carousel-item">
                        <img src="/assets/images/slide2.jpg" className="d-block w-100" alt="Zapatilla 2" />
                        
                    </div>
                    <div className="carousel-item">
                        <img src="/assets/images/slide3.jpg" className="d-block w-100" alt="Zapatilla 3" />
                        
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Anterior</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Siguiente</span>
                </button>
            </div>

            {/* Productos destacados en filas */}
            <div className="container">
                <h2 className="text-center mb-3">Productos Destacados</h2>
                <div className="row">
                    {products.map((product) => (
                        <div className="col-6 col-md-4 col-lg-3 mb-4" key={product._id}>
                            <div className="card h-100 shadow-sm border-0">
                                <img src={product.imagen} className="card-img-top" alt={product.nombre} />
                                <div className="card-body text-center">
                                    <h5 className="card-title font-weight-bold">{product.nombre}</h5>
                                    <p className="text-muted small">{product.descripcion}</p>
                                    <p className="text-primary fw-bold">${product.precio}</p>
                                    <button className="btn btn-dark btn-sm mt-2" onClick={() => handleShowDetails(product)}>
                                        Ver detalles
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Banner */}
            <div className="banner mt-4 mb-4 p-5 text-center" style={{ backgroundImage: "url('../assets/images/banner.jpg')", backgroundSize: 'cover', color: 'white', borderRadius: '8px' }}>
                <h1 className="display-4 fw-bold">Bienvenido a PisadaPro</h1>
                <p className="lead">Encuentra el calzado perfecto para tu estilo y comodidad</p>
                <button className="btn btn-outline-light btn-lg mt-3">Ver colecciones</button>
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

export default Home;
