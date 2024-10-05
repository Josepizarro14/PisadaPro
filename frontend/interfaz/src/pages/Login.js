import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            
            // Verifica la respuesta del servidor
            console.log(response.data); // Asegúrate de que esto muestre lo que esperas
            
            // Aquí puedes hacer algo con la respuesta, como guardar el rol o el token
            if (response.data.message === 'Inicio de sesión exitoso.') {
                console.log('Inicio de sesión exitoso'); // Asegúrate de ver esto en la consola
                // Puedes manejar el rol aquí si es necesario
                const role = response.data.role;
                console.log(`Rol del usuario: ${role}`);
                // Redirige o guarda el estado del usuario
                navigate('/Home');
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
            <div className="row justify-content-center">
                <div className="col-md-6">
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
                        {error && <div className="alert alert-danger">{error}</div>}
                        <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
