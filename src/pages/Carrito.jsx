import { Link } from 'react-router-dom';

function Carrito({ carrito, eliminarDelCarrito, limpiarCarrito }) {
  const calcularTotal = () => carrito.reduce((sum, prod) => sum + prod.precio, 0);

  if (carrito.length === 0) {
    return (
      <div className="carrito-vacio">
        <h2>🛒 Tu carrito está vacío</h2>
        <p>Vuelve a nuestro catálogo y agrega productos</p>
        <Link to="/" className="btn-accion">Continuar Comprando</Link>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h2>🛒 Tu Carrito</h2>
      <div className="carrito-contenido">
        <div className="carrito-items">
          {carrito.map((producto, index) => (
            <div key={index} className="carrito-item">
              <div className="item-imagen">
                <img src={producto.imagen} alt={producto.nombre} />
              </div>
              <div className="item-info">
                <h4>{producto.nombre}</h4>
                <p className="categoria-tag">{producto.categoria}</p>
                <p className="precio-item">${producto.precio}</p>
              </div>
              <button 
                onClick={() => eliminarDelCarrito(index)} 
                className="btn-eliminar"
              >
                🗑️ Eliminar
              </button>
            </div>
          ))}
        </div>

        <div className="carrito-resumen">
          <h3>Resumen</h3>
          <div className="fila-resumen">
            <span>Subtotal ({carrito.length} productos):</span>
            <span className="precio-resumen">${calcularTotal()}</span>
          </div>
          <div className="fila-resumen">
            <span>Envío:</span>
            <span className="precio-resumen">$500</span>
          </div>
          <div className="fila-resumen impuesto">
            <span>Impuestos:</span>
            <span className="precio-resumen">${Math.round(calcularTotal() * 0.21)}</span>
          </div>
          <div className="total-carrito">
            <span>TOTAL:</span>
            <span className="monto-total">${calcularTotal() + 500 + Math.round(calcularTotal() * 0.21)}</span>
          </div>
          
          <Link to="/pagar" className="btn-accion btn-pagar">
            Proceder al Pago 💳
          </Link>
          <button 
            onClick={limpiarCarrito} 
            className="btn-limpiar"
          >
            Vaciar Carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default Carrito;
