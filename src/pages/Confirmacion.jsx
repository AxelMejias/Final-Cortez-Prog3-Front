import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';

function Confirmacion() {
  const numeroOrden = Math.floor(100000 + Math.random() * 900000);
  const fecha = new Date().toLocaleDateString('es-AR');

  return (
    <div className="confirmacion-container">
      <div className="confirmacion-contenido">
        <div className="icono-exito-grande">✅</div>
        <h1>¡Pago Exitoso!</h1>
        <p className="texto-confirmacion">Tu compra ha sido procesada correctamente en Librería Emelyn</p>

        <div className="detalles-confirmacion">
          <div className="fila-detalle-conf">
            <span>Número de Orden:</span>
            <strong>#{numeroOrden}</strong>
          </div>
          <div className="fila-detalle-conf">
            <span>Fecha:</span>
            <strong>{fecha}</strong>
          </div>
          <div className="fila-detalle-conf">
            <span>Estado:</span>
            <strong className="estado-confirmacion">✓ En Preparación</strong>
          </div>
        </div>

        <div className="acciones-confirmacion">
          <Link to="/" className="btn-accion">Volver al Inicio</Link>
          <Link to="/historial" className="btn-secundario">Ver Historial de Compras</Link>
        </div>
      </div>
    </div>
  );
}

export default Confirmacion;
