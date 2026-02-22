import { Link, useLocation } from 'react-router-dom';
import API_BASE_URL from '../config/api';

function PagoRealizado() {
  const location = useLocation();
  const boleta = location.state?.boleta;
  const numeroOrden = boleta?.id || 'PENDIENTE';
  const fecha = boleta?.fecha || new Date().toLocaleDateString('es-AR');

  return (
    <div className="pago-realizado-container">
      <div className="contenido-exito">
        <div className="icono-exito-grande">✅</div>
        
        <h1>¡Pago Realizado Exitosamente!</h1>
        <p className="texto-exito">Tu compra ha sido procesada correctamente</p>

        <div className="detalles-orden">
          <h2>Detalles de tu Pedido</h2>
          <div className="fila-detalle">
            <span>Número de Orden:</span>
            <span className="valor">#{numeroOrden}</span>
          </div>
          <div className="fila-detalle">
            <span>Fecha:</span>
            <span className="valor">{fecha}</span>
          </div>
          <div className="fila-detalle">
            <span>Estado:</span>
            <span className="valor estado-entrega">{boleta?.estado || 'En Preparación'} 📦</span>
          </div>
        </div>

        <div className="proximos-pasos">
          <h3>Próximos Pasos</h3>
          <ol>
            <li>Recibirás un email de confirmación en los próximos minutos</li>
            <li>Tu pedido será preparado en nuestras oficinas</li>
            <li>Recibirás notificación sobre el envío</li>
            <li>¡Tu pedido llegará a tu domicilio en 3-5 días hábiles!</li>
          </ol>
        </div>

        <div className="botones-finales">
          <Link to="/historial" className="btn-accion btn-historial">
            Ver Mi Historial 📜
          </Link>
          <Link to="/" className="btn-accion btn-seguir-comprando">
            Seguir Comprando 🛍️
          </Link>
        </div>

        <p className="texto-soporte">
          ¿Necesitas ayuda? Contáctanos a emelyn@libreria.com.ar
        </p>
      </div>
    </div>
  );
}

export default PagoRealizado;
