import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { handleLogout } from '../services/auth';

const UpdateAccount = () => {
    const [userData, setUserData] = useState({
        rut_persona: '',
        nombre: '',
        apellido: '',
        direccion: '',
        comuna: '',
        region: '',
        email: '',
        telefono: '',
        contrasena: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');
    const [error, setError] = useState('');
    const [logoutMessage, setLogoutMessage] = useState(''); // Nuevo estado para el mensaje de cierre de sesión
    const navigate = useNavigate();
    const { updateUser } = useUser();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/user');
                setUserData(response.data);
                setOriginalEmail(response.data.email);
            } catch (error) {
                console.error(error);
                setError('Error al cargar los datos del usuario.');
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/edit_profile', userData); // Actualiza el perfil
    
            // Verificar si el correo electrónico ha cambiado
            if (userData.email !== originalEmail) {
                setLogoutMessage('Se ha cambiado el correo electrónico. Cerrando sesión...');
                await handleLogout(); // Cierra sesión si el correo electrónico ha cambiado
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('userName');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userEmail');
                setTimeout(() => {
                    navigate('/login'); // Redirige a la página de login
                }, 2000); // Espera 2 segundos antes de redirigir
                return;
            }
            
            setSuccessMessage('Datos actualizados exitosamente.');
            updateUser({ userName: userData.nombre, email: userData.email });
            setTimeout(() => {
                navigate('/'); // Redirige al inicio
            }, 2000); // Espera 2 segundos antes de redirigir
        } catch (error) {
            console.error(error);
            setError('Error al actualizar los datos.');
        }
    };
    

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Actualizar Cuenta</h2>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {logoutMessage && <div className="alert alert-warning">{logoutMessage}</div>} {/* Mostrar mensaje de cierre de sesión */}
            <form onSubmit={handleSubmit} className="border p-4 rounded shadow bg-light">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="rut_persona" className="form-label">RUT</label>
                        <input
                            type="text"
                            id="rut_persona"
                            className="form-control"
                            name="rut_persona"
                            value={userData.rut_persona}
                            readOnly
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            className="form-control"
                            name="nombre"
                            value={userData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="apellido" className="form-label">Apellido</label>
                        <input
                            type="text"
                            id="apellido"
                            className="form-control"
                            name="apellido"
                            value={userData.apellido}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="direccion" className="form-label">Dirección</label>
                        <input
                            type="text"
                            id="direccion"
                            className="form-control"
                            name="direccion"
                            value={userData.direccion}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="comuna" className="form-label">Comuna</label>
                        <input
                            type="text"
                            id="comuna"
                            className="form-control"
                            name="comuna"
                            value={userData.comuna}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="region" className="form-label">Región</label>
                        <input
                            type="text"
                            id="region"
                            className="form-control"
                            name="region"
                            value={userData.region}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="telefono" className="form-label">Teléfono</label>
                        <input
                            type="text"
                            id="telefono"
                            className="form-control"
                            name="telefono"
                            value={userData.telefono}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="contrasena" className="form-label">Nueva Contraseña (opcional)</label>
                    <input
                        type="password"
                        id="contrasena"
                        className="form-control"
                        name="contrasena"
                        value={userData.contrasena}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Actualizar</button>
            </form>
        </div>
    );
};

export default UpdateAccount;
