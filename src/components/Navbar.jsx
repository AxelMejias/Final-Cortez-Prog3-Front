import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar({ cantidadCarrito, cantidadFavoritos, usuario, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };
  // Ocultamos el carrito si estamos en la vista de pago
  const mostrarCarrito = location.pathname !== '/pagar' && location.pathname !== '/confirmacion' && location.pathname !== '/pago-realizado';

  return (
    <header>
      <div className="header-content">
        <Link to="/" className="logo-link">
          <img src="/logo-emelyn.png" alt="Librería Emelyn" className="logo-imagen" />
        </Link>

        <div className="acciones-header">
          {usuario ? (
            <>
              <Link to="/historial" className="burbuja-btn burbuja-usuario">
                👤 Hola, {usuario.nombre}
              </Link>
              <button onClick={handleLogoutClick} className="burbuja-btn burbuja-logout">
                🚪 Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="burbuja-btn burbuja-ingresar">
              🔑 Ingresar
            </Link>
          )}

          {mostrarCarrito && (
            <>
              {usuario?.tipo === 'cliente' && (
                <Link to="/favoritos" className="burbuja-btn burbuja-favoritos">
                  <span className="icono-carrito">❤️</span>
                  {cantidadFavoritos > 0 && <span className="badge">{cantidadFavoritos}</span>}
                </Link>
              )}
              <Link to="/carrito" className="burbuja-btn burbuja-carrito">
                <span className="icono-carrito">🛒</span>
                {cantidadCarrito > 0 && <span className="badge">{cantidadCarrito}</span>}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;