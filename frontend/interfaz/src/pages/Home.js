import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

const catalogApi = axios.create({
    baseURL: 'http://localhost:5002', // URL del microservicio de catálogo
    withCredentials: true,
});

const Home = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

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

    // Abrir el modal con detalles del producto seleccionado
    const handleShowDetails = (product) => {
        setSelectedProduct(product);
    };

    // Cerrar el modal
    const handleClose = () => {
        setSelectedProduct(null);
    };

    return (
        <div>
            {/* Carrusel */}
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
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
            <div className="container mt-4">
                <div className="row">
                    {products.map((product) => (
                        <div className="col-6 col-md-4 col-lg-3 mb-4" key={product._id}> {/* Ajuste de clases para el tamaño de columnas */}
                            <div className="card h-100">
                                <img src={product.imagen} className="card-img-top" alt={product.nombre} />
                                <div className="card-body text-center">
                                    <h5 className="card-title">{product.nombre}</h5>
                                    <p className="card-text">{product.descripcion}</p>
                                    <p className="card-text"><strong>${product.precio}</strong></p>
                                    <p className="card-text">Stock: {product.stock}</p> {/* Mostrar stock */}
                                    <button className="btn btn-primary" onClick={() => handleShowDetails(product)}>Ver detalles</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Banner */}
            <div className="banner mt-4" style={{ backgroundImage: "url('../assets/images/banner.jpg')", backgroundSize: 'cover', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Bienvenido a PisadaPro</h1>
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

export default Home;
