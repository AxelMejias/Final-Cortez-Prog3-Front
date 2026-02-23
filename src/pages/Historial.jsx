import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

function Historial() {
  const [esAdmin, setEsAdmin] = useState(false);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          setCompras([]);
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/boletas/${encodeURIComponent(userEmail)}`);
        if (!response.ok) {
          throw new Error('No se pudo cargar el historial');
        }

        const data = await response.json();
        setCompras(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const adminToken = localStorage.getItem('adminToken');
    setEsAdmin(!!adminToken);

    cargarHistorial();
  }, []);

  const getIconoEstado = (estado) => {
    switch(estado) {
      case 'Entregado': return '✅';
      case 'En camino': return '🚚';
      case 'Procesando': return '⏳';
      default: return '📦';
    }
  };

  const getColorEstado = (estado) => {
    return estado === 'Entregado' ? 'entregado' : 
           estado === 'En camino' ? 'en-camino' : 'procesando';
  };

  return (
    <div className="historial-container">
      <h2>📜 Historial de Compras</h2>
      <p className="historial-subtitle">Aquí puedes ver todas tus compras realizadas</p>

      {loading && <div className="loading-mensaje">⏳ Cargando historial...</div>}
      {error && <div className="error-mensaje">{error}</div>}

      {!loading && compras.length === 0 ? (
        <div className="historial-vacio">
          <p>No tienes compras registradas</p>
          <Link to="/" className="btn-accion">Ir de Compras</Link>
        </div>
      ) : (
        <div className="tabla-contenedor">
          <table className="tabla-historial">
            <thead>
              <tr>
                <th>Pedido #</th>
                <th>Fecha</th>
                <th>Items</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Tracking</th>
              </tr>
            </thead>
            <tbody>
              {compras.map(compra => (
                <tr key={compra.id || compra._id} className={`fila-${getColorEstado(compra.estado)}`}>
                  <td className="celda-id">#{compra.id || compra._id}</td>
                  <td>{compra.fecha}</td>
                  <td>{(compra.productos || []).length} producto(s)</td>
                  <td className="celda-total">${compra.total}</td>
                  <td>
                    <span className={`estado-badge ${getColorEstado(compra.estado)}`}>
                      {getIconoEstado(compra.estado)} {compra.estado}
                    </span>
                  </td>
                  <td>
                    <button className="btn-tracking">
                      📍 AR-{String(compra.id || compra._id).slice(-6).toUpperCase()}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="historial-acciones">
        <Link to="/" className="btn-accion">Continuar Comprando</Link>
        <button className="btn-descargar">⬇️ Descargar Factura</button>
        {esAdmin && (
          <Link to="/admin" className="btn-admin-gestionar">
            ⚙️ Gestionar Pagina
          </Link>
        )}
      </div>
    </div>
  );
}

export default Historial;
