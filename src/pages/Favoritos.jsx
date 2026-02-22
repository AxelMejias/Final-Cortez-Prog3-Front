import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';

function Favoritos({ favoritos, toggleFavorito, agregarAlCarrito }) {
  if (!favoritos || favoritos.length === 0) {
    return (
      <div className="carrito-vacio">
        <h2>❤️ No tienes favoritos</h2>
        <p>Guarda productos para verlos luego</p>
        <Link to="/" className="btn-accion">Explorar Productos</Link>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h2>❤️ Mis Favoritos</h2>
      <div className="carrito-contenido">
        <div className="carrito-items">
          {favoritos.map((producto, index) => (
            <div key={`${producto.productoId}-${index}`} className="carrito-item">
              <div className="item-imagen">
                <img src={producto.imagen} alt={producto.nombre} />
              </div>
              <div className="item-info">
                <h4>{producto.nombre}</h4>
                <p className="categoria-tag">{producto.categoria}</p>
                <p className="precio-item">${producto.precio}</p>
              </div>
              <div className="acciones-favoritos">
                <button onClick={() => agregarAlCarrito(producto)} className="btn-agregar-carrito-mini">
                  🛒
                </button>
                <button onClick={() => toggleFavorito(producto)} className="btn-eliminar">
                  🗑️ Quitar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="carrito-resumen">
          <h3>Favoritos</h3>
          <div className="fila-resumen">
            <span>Total guardados:</span>
            <span className="precio-resumen">{favoritos.length}</span>
          </div>
          <div className="fila-resumen impuesto">
            <span>Valor estimado:</span>
            <span className="precio-resumen">${favoritos.reduce((acc, item) => acc + item.precio, 0)}</span>
          </div>
          <Link to="/" className="btn-accion">Seguir Viendo Productos</Link>
        </div>
      </div>
    </div>
  );
}

export default Favoritos;
