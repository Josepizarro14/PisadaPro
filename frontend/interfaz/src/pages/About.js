// src/pages/About.js
import React from 'react';

const About = () => {
    return (
        <div className="container mt-5">
            {/* Título principal */}
            <h1 className="text-center mb-4">Sobre Nosotros</h1>

            {/* Sección de Misión, Visión y Valores */}
            <section className="mb-5">
                <div className="row">
                    <div className="col-md-4 text-center">
                        <h3 className="text-primary">Nuestra Misión</h3>
                        <p>
                            Proporcionar calzado de alta calidad que combine estilo, comodidad y accesibilidad para todos nuestros clientes.
                        </p>
                    </div>
                    <div className="col-md-4 text-center">
                        <h3 className="text-primary">Nuestra Visión</h3>
                        <p>
                            Ser líderes en la industria del calzado, ofreciendo productos innovadores y sostenibles que transformen la experiencia del cliente.
                        </p>
                    </div>
                    <div className="col-md-4 text-center">
                        <h3 className="text-primary">Nuestros Valores</h3>
                        <ul className="list-unstyled">
                            <li>✔ Compromiso con la calidad</li>
                            <li>✔ Innovación constante</li>
                            <li>✔ Atención al cliente</li>
                            <li>✔ Sostenibilidad</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Sección de Historia */}
            <section className="mb-5">
                <h2 className="text-center">Nuestra Historia</h2>
                <p className="text-justify mt-3">
                    Fundada en 2024, **PisadaPro** nació con el objetivo de revolucionar la manera en que las personas encuentran su calzado ideal. Desde nuestros humildes comienzos en un pequeño taller, hemos crecido hasta convertirnos en una marca reconocida a nivel nacional, con una fuerte presencia en línea y en tiendas físicas. Creemos en la combinación perfecta entre diseño, confort y sostenibilidad.
                </p>
            </section>

            {/* Sección de Equipo */}
            <section className="mb-5">
                <h2 className="text-center">Conoce a Nuestro Equipo</h2>
                <div className="row mt-4">
                    {[
                        {
                            name: 'José Pizarro',
                            role: 'CEO y Fundador',
                            image: '/assets/images/team1.png',
                        },
                        {
                            name: 'Matías Barra',
                            role: 'Director de Diseño',
                            image: '/assets/images/team2.png',
                        },
                        {
                            name: 'Brayan Avalos',
                            role: 'Jefe de Ventas',
                            image: '/assets/images/team3.png',
                        },
                    ].map((member, index) => (
                        <div className="col-md-4 text-center" key={index}>
                            <img
                                src={member.image}
                                alt={member.name}
                                className="rounded-circle mb-3"
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                            <h5>{member.name}</h5>
                            <p className="text-muted">{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sección de CTA (Call to Action) */}
            <section className="text-center mt-5">
                <h2 className="mb-3">¿Quieres saber más sobre nosotros?</h2>
                <p className="lead">
                    Nos encantaría escucharte. Ponte en contacto con nosotros y descubre cómo podemos ayudarte a encontrar el calzado perfecto.
                </p>
                <a href="/contact" className="btn btn-primary btn-lg">
                    Contáctanos
                </a>
            </section>
        </div>
    );
};

export default About;
