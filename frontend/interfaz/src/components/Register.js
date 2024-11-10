// src/components/Register.js
import React, { useState } from 'react';
import { userApi } from '../services/api';  // Importar la instancia de Axios como exportación nombrada
import { useNavigate } from 'react-router-dom';  // Para redirigir al usuario después del registro

const Register = () => {
  const [formData, setFormData] = useState({
    rut_persona: '',
    nombre: '',
    apellido: '',
    direccion: '',
    comuna: '',
    region: '',
    email: '',
    telefono: '',
    contrasena: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await userApi.post('/register', formData);
        setSuccessMessage(response.data.message);
        setErrorMessage(''); // Limpiar el mensaje de error si el registro es exitoso
        setTimeout(() => navigate('/login'), 2000); // Redirigir al usuario después de 2 segundos
    } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Error en el registro.');
        setSuccessMessage(''); // Limpiar el mensaje de éxito si hay un error
    }
};

  return (
    <div className="container mt-5 text-center">
      <h2 className="text-dark mb-4">Registrar Usuario</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">RUT</label>
                    <input
                      type="text"
                      name="rut_persona"
                      value={formData.rut_persona}
                      onChange={handleChange}
                      className="form-control border-dark"
                      required
                      style={{ backgroundColor: '#f9f9f9', color: '#333' }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="form-control border-dark"
                      required
                      style={{ backgroundColor: '#f9f9f9', color: '#333' }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      className="form-control border-dark"
                      required
                      style={{ backgroundColor: '#f9f9f9', color: '#333' }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className="form-control border-dark"
                      required
                      style={{ backgroundColor: '#f9f9f9', color: '#333' }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">Comuna</label>
                    <input
                      type="text"
                      name="comuna"
                      value={formData.comuna}
                      onChange={handleChange}
                      className="form-control border-dark"
                      required
                      style={{ backgroundColor: '#f9f9f9', color: '#333' }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">Región</label>
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="form-control border-dark"
                      required
                      style={{ backgroundColor: '#f9f9f9', color: '#333' }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control border-dark"
                      required
                      style={{ backgroundColor: '#f9f9f9', color: '#333' }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">Teléfono</label>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="form-control border-dark"
                      required
                      style={{ backgroundColor: '#f9f9f9', color: '#333' }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-dark">Contraseña</label>
                  <input
                    type="password"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    className="form-control border-dark"
                    required
                    style={{ backgroundColor: '#f9f9f9', color: '#333' }}
                  />
                </div>

                <button type="submit" className="btn btn-dark mt-3 w-100">Registrarse</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
