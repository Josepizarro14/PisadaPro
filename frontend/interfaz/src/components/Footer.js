// src/components/Footer.js
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white text-center text-lg-start py-4">
            <div className="container">
                <div className="text-center p-3">
                    © {new Date().getFullYear()} PisadaPro. Todos los derechos reservados.
                </div>
                <div className="text-center p-3">
                    <a href="/about" className="text-white">Sobre Nosotros</a> | 
                    <a href="/contact" className="text-white"> Contacto</a> | 
                    <a href="/conditions" className="text-white">Términos de Servicio</a> | 
                    <a href="/privacity" className="text-white">Política de Privacidad</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
