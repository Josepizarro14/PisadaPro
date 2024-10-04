// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ currentUser }) => {
    return (
        <>
            <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src="/static/images/logo.png" alt="PisadaPro Logo" style={{ maxHeight: '50px' }} />
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/about">Sobre nosotros</Link>
                            </li>

                            {/* Mostrar enlace al panel de administración solo si el usuario es administrador */}
                            {currentUser?.rol === 'administrador' && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin">Panel de administración</Link>
                                </li>
                            )}

                            {/* Condicional basado en el estado de autenticación */}
                            {currentUser?.isAuthenticated ? (
                                <li className="nav-item dropdown">
                                    <Link
                                        className="nav-link dropdown-toggle"
                                        to="#"
                                        id="userDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        Hola, {currentUser.nombre}
                                    </Link>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                        <li>
                                            <Link className="dropdown-item" to="/edit_profile">Actualizar datos</Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/logout">Cerrar sesión</Link>
                                        </li>
                                    </ul>
                                </li>
                            ) : (
                                <li className="nav-item dropdown">
                                    <Link
                                        className="nav-link dropdown-toggle"
                                        to="#"
                                        id="navbarDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <i className="fas fa-user"></i> Cuenta
                                    </Link>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <li>
                                            <Link className="dropdown-item" to="/login">Iniciar sesión</Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/register">Registrarse</Link>
                                        </li>
                                    </ul>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container mt-5">
                {/* Aquí se puede colocar el contenido que se renderiza en las diferentes páginas */}
            </div>
        </>
    );
};

export default Navbar;
