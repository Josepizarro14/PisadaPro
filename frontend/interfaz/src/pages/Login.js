import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setError(''); // Limpiar mensaje de error al intentar nuevamente
        try {
            // Agrega { withCredentials: true } para enviar cookies
            const response = await api.post('/login', { email, password }, { withCredentials: true });

            console.log(response.data); // Verificar la respuesta en la consola

            // Verificar si el inicio de sesión fue exitoso
            if (response.data.message === 'Inicio de sesión exitoso.') {
                // Almacena información del usuario en localStorage
                localStorage.setItem('userRole', response.data.role);
                localStorage.setItem('userName', response.data.nombre);
                localStorage.setItem('isAuthenticated', true);

                console.log('Inicio de sesión exitoso');
                setSuccessMessage('Has iniciado sesión exitosamente.');

                // Redirigir después de 2 segundos
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
            } else {
                setError('Error en el inicio de sesión.');
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Iniciar Sesión</h2>
            <div className="row justify-content-center mt-4">



                <div className="col-md-6">

                    {/* Mostrar mensaje de éxito */}
                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            {successMessage}
                        </div>
                    )}

                    {/* Mostrar mensaje de error */}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="border p-4 rounded shadow">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ingresa tu email"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ingresa tu contraseña"
                                required
                            />
                        </div>



                        <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
