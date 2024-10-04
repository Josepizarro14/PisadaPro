// src/components/About.js
import React, { useState, useEffect } from 'react';

const About = () => {
    // Suponiendo que los mensajes se reciben como props o desde un estado global
    const [messages, setMessages] = useState([]);

    // Simulación de recibir mensajes (puedes reemplazar esto con tu lógica)
    useEffect(() => {
        // Aquí puedes obtener mensajes desde una API o estado global
        const fetchedMessages = [
            { category: 'success', text: '¡Bienvenido a PisadaPro!' },
            // Puedes agregar más mensajes aquí
        ];
        setMessages(fetchedMessages);
    }, []);

    return (
        <div className="container">
            {/* Mostrar mensajes si existen */}
            {messages.length > 0 && (
                <div className="mt-3">
                    {messages.map((message, index) => (
                        <div key={index} className={`alert alert-${message.category}`}>
                            {message.text}
                        </div>
                    ))}
                </div>
            )}
            <h1 className="mt-5">Sobre Nosotros</h1>
            <p className="lead">
                Bienvenido a PisadaPro, tu tienda en línea de confianza para todas tus necesidades de calzado.
                Nuestra misión es ofrecerte una experiencia de compra única y productos de la más alta calidad.
            </p>

            <h2>Nuestra Historia</h2>
            <p>
                Fundada en [Año de fundación], PisadaPro nació de la pasión por el calzado y el deseo de brindar
                a nuestros clientes una amplia selección de estilos y marcas.
                Desde nuestros inicios, hemos trabajado arduamente para asegurarnos de que cada par de zapatos
                que vendemos cumpla con nuestros altos estándares de calidad.
            </p>

            <h2>Nuestros Valores</h2>
            <ul>
                <li><strong>Calidad:</strong> Solo trabajamos con los mejores fabricantes.</li>
                <li><strong>Servicio al Cliente:</strong> Tu satisfacción es nuestra prioridad.</li>
                <li><strong>Sostenibilidad:</strong> Nos esforzamos por ser responsables con el medio ambiente.</li>
            </ul>

            <h2>Contáctanos</h2>
            <p>
                Si tienes preguntas o necesitas ayuda, no dudes en contactarnos a través de nuestro formulario de contacto.
                Estamos aquí para ayudarte.
            </p>
        </div>
    );
};

export default About;
