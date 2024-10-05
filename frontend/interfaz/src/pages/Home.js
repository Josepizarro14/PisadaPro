// src/pages/Home.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap

const Home = () => {
    return (
        <div className="container mt-5">
            <h1 className="text-center">Bienvenido a PisadaPro</h1>
            <p className="text-center">Explora nuestra variedad de zapatillas.</p>

            {/* Carrusel */}
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="https://via.placeholder.com/800x400.png?text=Zapatilla+1" className="d-block w-100" alt="Zapatilla 1" />
                    </div>
                    <div className="carousel-item">
                        <img src="https://via.placeholder.com/800x400.png?text=Zapatilla+2" className="d-block w-100" alt="Zapatilla 2" />
                    </div>
                    <div className="carousel-item">
                        <img src="https://via.placeholder.com/800x400.png?text=Zapatilla+3" className="d-block w-100" alt="Zapatilla 3" />
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
        </div>
    );
};

export default Home;
