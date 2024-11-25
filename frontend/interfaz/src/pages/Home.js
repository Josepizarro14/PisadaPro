import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCart } from '../contexts/CartContext';
import '../styles/styles.css';
import '../styles/stylesProduct.css';

const catalogApi = axios.create({
    baseURL: 'http://localhost:5002', // URL del microservicio de catálogo
    withCredentials: true,
});

const Home = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToCart } = useCart(); // Usa la función addToCart del contexto
    const [selectedTalla, setSelectedTalla] = useState(null); // Talla seleccionada
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

export default Home;
