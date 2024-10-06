import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';  // Asegúrate de que esto esté correctamente configurado
import { Modal } from 'react-bootstrap';

const AdminPanel = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); // Inicializa currentUser
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        const isAuthenticated = localStorage.getItem('isAuthenticated');

        // Redirigir si no está autenticado
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // Verificar el rol del usuario
        if (role !== 'administrador') {
            alert('No tienes permiso para acceder a esta página.');
            navigate('/');  // Redirige a la página de inicio si no es administrador
            return; // Salir de useEffect si no es admin
        }

        const fetchUsuarios = async () => {
            try {
                const response = await api.get('/admin');
                console.log('Respuesta de la API:', response);
                setUsuarios(response.data);
            } catch (error) {
                console.error('Error al cargar los usuarios:', error);
                setError('Error al cargar los usuarios');
            }
        };

        fetchUsuarios();  // Llamar a la función para obtener usuarios

    }, [navigate]);

    const eliminarUsuario = async (email) => {
        try {
            await api.delete(`/delete_client/${email}`); // Asegúrate de que este endpoint esté correcto
            setSuccessMessage('Usuario eliminado correctamente');
            setUsuarios(usuarios.filter(user => user.email !== email));
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            setError('Error al eliminar el usuario');
        }
    };

    const handleShowModal = (usuario) => {
        setCurrentUser(usuario);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentUser(null);
    };

    const handleEditUser = async () => {
        try {
            await api.put(`/edit_client/${currentUser.email}`, currentUser); // Ajusta esto según tu API
            setSuccessMessage('Usuario actualizado correctamente');
            setUsuarios(usuarios.map(user => user.email === currentUser.email ? currentUser : user));
            handleCloseModal();
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            setError('Error al actualizar el usuario');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mt-4">Panel de Control del Administrador</h2>
            <p className="text-center">Aquí puedes gestionar productos, usuarios y más.</p>
            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <table className="table table-striped table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th>RUT</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Dirección</th>
                        <th>Comuna</th>
                        <th>Región</th>
                        <th>Teléfono</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(usuario => (
                        <tr key={usuario.email}>
                            <td>{usuario.rut_persona}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.apellido}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.direccion}</td>
                            <td>{usuario.comuna}</td>
                            <td>{usuario.region}</td>
                            <td>{usuario.telefono}</td>
                            <td>{usuario.rol}</td>
                            <td>
                                <button className="btn btn-info btn-sm me-2" onClick={() => handleShowModal(usuario)}>Editar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => eliminarUsuario(usuario.email)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para editar usuario */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentUser && (
                        <div>
                            <div className="mb-3">
                                <label htmlFor="rut_persona" className="form-label">RUT</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="rut_persona"
                                    value={currentUser.rut_persona}
                                    onChange={(e) => setCurrentUser({ ...currentUser, rut_persona: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombre"
                                    value={currentUser.nombre}
                                    onChange={(e) => setCurrentUser({ ...currentUser, nombre: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="apellido" className="form-label">Apellido</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="apellido"
                                    value={currentUser.apellido}
                                    onChange={(e) => setCurrentUser({ ...currentUser, apellido: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="direccion" className="form-label">Dirección</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="direccion"
                                    value={currentUser.direccion}
                                    onChange={(e) => setCurrentUser({ ...currentUser, direccion: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="comuna" className="form-label">Comuna</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="comuna"
                                    value={currentUser.comuna}
                                    onChange={(e) => setCurrentUser({ ...currentUser, comuna: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="region" className="form-label">Región</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="region"
                                    value={currentUser.region}
                                    onChange={(e) => setCurrentUser({ ...currentUser, region: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="telefono" className="form-label">Teléfono</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="telefono"
                                    value={currentUser.telefono}
                                    onChange={(e) => setCurrentUser({ ...currentUser, telefono: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="contrasena" className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="contrasena"
                                    onChange={(e) => setCurrentUser({ ...currentUser, contrasena: e.target.value })}
                                />
                            </div>
                            {/* Agrega más campos según sea necesario */}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={handleCloseModal}>Cerrar</button>
                    <button className="btn btn-primary" onClick={handleEditUser}>Guardar cambios</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminPanel;
