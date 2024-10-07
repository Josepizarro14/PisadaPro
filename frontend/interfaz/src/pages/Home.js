// src/pages/Home.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap
import '../styles/styles.css';


const Home = () => {
    return (
        <div>

            {/*<div className="container mt-5 text-center">
                <p>Explora nuestra variedad de zapatillas y disfruta de una experiencia de compra única.</p>
            </div>
            */}
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




            {/* Productos destacados en tres columnas */}
            <div className="container mt-2">
                <div className="row">
                    <div className="col-sm-2">
                        <div className="card h-100 card2">
                            <img src="/assets/images/imagen1.jpg" className="card-img-top card2-img-top" alt="Zapatilla 1" />
                            <div className="card-body text-center card2-body">
                                <h5 className="card-title card2-title">Zapatilla 1</h5>
                                <p className="card-text card2-text">Descripción breve.</p>
                                <a href="#" className="btn btn-primary">Ver detalles</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className="card h-100 card2">
                            <img src="/assets/images/imagen2.jpg" className="card-img-top card2-img-top" alt="Zapatilla 2" />
                            <div className="card-body text-center card2-body">
                                <h5 className="card-title card2-title">Zapatilla 2</h5>
                                <p className="card-text card2-text">Descripción breve.</p>
                                <a href="#" className="btn btn-primary">Ver detalles</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className="card h-100 card2">
                            <img src="/assets/images/imagen3.jpg" className="card-img-top card2-img-top" alt="Zapatilla 3" />
                            <div className="card-body text-center card2-body">
                                <h5 className="card-title card2-title">Zapatilla 3</h5>
                                <p className="card-text card2-text">Descripción breve.</p>
                                <a href="#" className="btn btn-primary">Ver detalles</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className="card h-100 card2">
                            <img src="/assets/images/imagen4.jpg" className="card-img-top card2-img-top" alt="Zapatilla 4" />
                            <div className="card-body text-center card2-body">
                                <h5 className="card-title card2-title">Zapatilla 4</h5>
                                <p className="card-text card2-text">Descripción breve.</p>
                                <a href="#" className="btn btn-primary">Ver detalles</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className="card h-100 card2">
                            <img src="/assets/images/imagen5.jpg" className="card-img-top card2-img-top" alt="Zapatilla 5" />
                            <div className="card-body text-center card2-body">
                                <h5 className="card-title card2-title">Zapatilla 5</h5>
                                <p className="card-text card2-text">Descripción breve.</p>
                                <a href="#" className="btn btn-primary">Ver detalles</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className="card h-100 card2">
                            <img src="/assets/images/imagen6.jpg" className="card-img-top card2-img-top" alt="Zapatilla 6" />
                            <div className="card-body text-center card2-body">
                                <h5 className="card-title card2-title">Zapatilla 6</h5>
                                <p className="card-text card2-text">Descripción breve.</p>
                                <a href="#" className="btn btn-primary">Ver detalles</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>




            {/* Banner */}
            <div className="banner mt-4" style={{ backgroundImage: "url('../assets/images/banner.jpg')", backgroundSize: 'cover', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Bienvenido a PisadaPro</h1>
            </div>

        </div>
    );
};

export default Home;
