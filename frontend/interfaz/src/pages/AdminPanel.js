
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';  // Asegúrate de que esto esté correctamente configurado
import { Modal } from 'react-bootstrap';

const AdminPanel = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        rut_persona: '',
        nombre: '',
        apellido: '',
        direccion: '',
        comuna: '',
        region: '',
        email: '',
        telefono: '',
        contrasena: '',
        rol: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        const isAuthenticated = localStorage.getItem('isAuthenticated');

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (role !== 'administrador') {
            alert('No tienes permiso para acceder a esta página.');
            navigate('/');
            return;
        }

        const fetchUsuarios = async () => {
            try {
                const response = await api.get('/admin');
                setUsuarios(response.data);
            } catch (error) {
                setError('Error al cargar los usuarios');
            }
        };

        fetchUsuarios();
    }, [navigate]);

    const eliminarUsuario = async (email) => {
        try {
            await api.delete(`/delete_client/${email}`);
            setSuccessMessage('Usuario eliminado correctamente');
            setUsuarios(usuarios.filter(user => user.email !== email));
        } catch (error) {
            setError('Error al eliminar el usuario');
        }
    };

    const handleShowModal = (usuario = null) => {
        if (usuario) {
            setIsEditing(true);
            setCurrentUser(usuario);
        } else {
            setIsEditing(false);
            setCurrentUser({
                rut_persona: '',
                nombre: '',
                apellido: '',
                direccion: '',
                comuna: '',
                region: '',
                email: '',
                telefono: '',
                contrasena: '',
                rol: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentUser(null);
    };

    const handleEditUser = async () => {
        try {
            // Actualiza el usuario, utilizando el correo actual
            await api.put(`/edit_client/${currentUser.rut_persona}`, currentUser);
            setSuccessMessage('Usuario actualizado correctamente');
            setUsuarios(usuarios.map(user => user.rut_persona === currentUser.rut_persona ? currentUser : user));
            handleCloseModal();
        } catch (error) {
            setError('Error al actualizar el usuario');
        }
    };

    const handleCreateUser = async () => {
        try {
            await api.post('/create_client', currentUser);
            setSuccessMessage('Usuario creado correctamente');
            setUsuarios([...usuarios, currentUser]);
            handleCloseModal();
        } catch (error) {
            setError('Error al crear el usuario');
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
            {/* Botón para crear un nuevo usuario */}
            <button className="btn btn-primary mb-3" onClick={() => handleShowModal()}>Crear Nuevo Usuario</button>
            {/* Modal para crear/editar usuario */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentUser && (
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="rut_persona" className="form-label">RUT</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="rut_persona"
                                    value={currentUser.rut_persona}
                                    onChange={(e) => setCurrentUser({ ...currentUser, rut_persona: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombre"
                                    value={currentUser.nombre}
                                    onChange={(e) => setCurrentUser({ ...currentUser, nombre: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="apellido" className="form-label">Apellido</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="apellido"
                                    value={currentUser.apellido}
                                    onChange={(e) => setCurrentUser({ ...currentUser, apellido: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="direccion" className="form-label">Dirección</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="direccion"
                                    value={currentUser.direccion}
                                    onChange={(e) => setCurrentUser({ ...currentUser, direccion: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="comuna" className="form-label">Comuna</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="comuna"
                                    value={currentUser.comuna}
                                    onChange={(e) => setCurrentUser({ ...currentUser, comuna: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="region" className="form-label">Región</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="region"
                                    value={currentUser.region}
                                    onChange={(e) => setCurrentUser({ ...currentUser, region: e.target.value })}
                                />
                            </div>

                            {/* Campo Email: Editable solo cuando es creación */}
                            <div className="col-md-6 mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={currentUser.email}
                                    onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                                />
                            </div>


                            <div className="col-md-6 mb-3">
                                <label htmlFor="telefono" className="form-label">Teléfono</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="telefono"
                                    value={currentUser.telefono}
                                    onChange={(e) => setCurrentUser({ ...currentUser, telefono: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="contrasena" className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="contrasena"
                                    value={currentUser.contrasena}
                                    onChange={(e) => setCurrentUser({ ...currentUser, contrasena: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="rol" className="form-label">Rol</label>
                                <select
                                    className="form-select"
                                    id="rol"
                                    value={currentUser.rol}
                                    onChange={(e) => setCurrentUser({ ...currentUser, rol: e.target.value })}
                                >
                                    <option value="">Selecciona un rol</option>
                                    <option value="cliente">Cliente</option>
                                    <option value="administrador">Administrador</option>
                                </select>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                    <button className="btn btn-primary" onClick={isEditing ? handleEditUser : handleCreateUser}>
                        {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminPanel;
