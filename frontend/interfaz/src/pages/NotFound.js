import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css'; // Si tienes un archivo de estilos global

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </div>
  );
};

export default NotFound;
