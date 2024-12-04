import React, { useState, useEffect } from 'react';
import { userApi, cartApi } from '../services/api'; // Asegúrate de importar las APIs
import { Spinner, Container, Row, Col, Card, Button } from 'react-bootstrap';

const HistorialCompras = () => {
  const [email, setEmail] = useState('');
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para obtener el correo del usuario
  const fetchUserEmail = async () => {
    try {
      const response = await userApi.get('/obtenerCorreo');
      setEmail(response.data.email);
    } catch (err) {
      setError('No se pudo obtener el correo del usuario.');
    }
  };

  // Función para obtener el historial de compras del cliente
  const fetchCompras = async () => {
    try {
      const response = await cartApi.get(`/compras/${email}`);
      setCompras(response.data.compras);
      setLoading(false);
    } catch (err) {
      setError('No se pudo obtener el historial de compras.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserEmail();
  }, []);

  useEffect(() => {
    if (email) {
      fetchCompras();
    }
  }, [email]);

  return (
    <Container className="my-5">
      <h2>Historial de Compras</h2>
      {loading && <Spinner animation="border" />}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && compras.length === 0 && (
        <div className="alert alert-info">No tienes compras registradas.</div>
      )}

      <Row>
        {compras.map((compra) => (
          <Col key={compra.id} md={4} className="mb-4">
            <Card>
              <Card.Header>{compra.estado.toUpperCase()}</Card.Header>
              <Card.Body>
                <Card.Title>{compra.nombre_cliente}</Card.Title>
                <Card.Text>
                  <strong>Fecha:</strong> {new Date(compra.fecha).toLocaleString()}
                </Card.Text>
                <Card.Text>
                  <strong>Total:</strong> ${compra.total.toFixed(2)}
                </Card.Text>

                {compra.detalles.map((detalle) => (
                  <div key={detalle.id} className="mb-3">
                    <img
                      src={detalle.imagen}
                      alt={detalle.nombre_zapatilla}
                      className="img-fluid"
                      style={{ maxWidth: '150px' }}
                    />
                    <div className="mt-2">
                      <strong>Producto:</strong> {detalle.nombre_zapatilla}
                    </div>
                    <div>
                      <strong>Cantidad:</strong> {detalle.cantidad}
                    </div>
                    <div>
                      <strong>Talla:</strong> {detalle.talla}
                    </div>
                    <div>
                      <strong>Descripción:</strong> {detalle.descripcion}
                    </div>
                  </div>
                ))}

              
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HistorialCompras;
