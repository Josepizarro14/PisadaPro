import React, { useState } from 'react';
import { userApi } from '../services/api';  // Importar la instancia de Axios como exportación nombrada
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
        setError('');
        try {
            const response = await userApi.post('/login', { email, password }, { withCredentials: true });
            if (response.data.message === 'Inicio de sesión exitoso.') {
                localStorage.setItem('userRole', response.data.role);
                localStorage.setItem('userName', response.data.nombre);
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('authToken', response.data.token);
                setSuccessMessage('Has iniciado sesión exitosamente.');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
            } else {
                setError('Error en el inicio de sesión.');
            }
        }
    };

    return (
        <div className="container mt-5 text-center">
            <h2 className="text-center text-dark">Iniciar Sesión</h2>
            <div className="row justify-content-center mt-4">
                <div className="col-md-6">
                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            {successMessage}
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="border p-4 rounded shadow bg-light">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label text-dark">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control border-dark"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ingresa tu email"
                                required
                                style={{ backgroundColor: '#f9f9f9', color: '#333' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label text-dark">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control border-dark"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ingresa tu contraseña"
                                required
                                style={{ backgroundColor: '#f9f9f9', color: '#333' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-dark w-100">Iniciar Sesión</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
