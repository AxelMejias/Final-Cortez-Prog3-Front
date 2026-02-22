import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import API_BASE_URL from './config/api';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductoDetalle from './pages/ProductoDetalle';
import Carrito from './pages/Carrito';
import Login from './pages/Login';
import Registro from './pages/Registro';
import OlvidarContraseña from './pages/OlvidarContraseña';
import ResetPassword from './pages/ResetPassword';
import Favoritos from './pages/Favoritos';
import Pago from './pages/Pago';
import Historial from './pages/Historial';
import Confirmacion from './pages/Confirmacion';
import PagoRealizado from './pages/PagoRealizado';
import Admin from './pages/Admin';
import GestionCategorias from './components/GestionCategorias';

function App() {
  const [carrito, setCarrito] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        setUsuario(JSON.parse(userData));
      } catch (error) {
        console.error('Error parseando userData:', error);
      }
    }
  }, []);

  useEffect(() => {
    const cargarCarrito = async () => {
      if (!usuario || usuario.tipo !== 'cliente' || !usuario.email) {
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/api/carrito/${encodeURIComponent(usuario.email)}`);
        if (response.ok) {
          const data = await response.json();
          setCarrito(data.items || []);
        }
      } catch (error) {
        console.error('Error cargando carrito:', error);
      }
    };

    cargarCarrito();
  }, [usuario]);

  useEffect(() => {
    const cargarFavoritos = async () => {
      if (!usuario || usuario.tipo !== 'cliente' || !usuario.email) {
        setFavoritos([]);
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/api/favoritos/${encodeURIComponent(usuario.email)}`);
        if (response.ok) {
          const data = await response.json();
          setFavoritos(data.items || []);
        }
      } catch (error) {
        console.error('Error cargando favoritos:', error);
      }
    };

    cargarFavoritos();
  }, [usuario]);

  const agregarAlCarrito = async (producto) => {
    if (usuario && usuario.tipo === 'cliente' && usuario.email) {
      try {
        const response = await fetch(`http://localhost:4000/api/carrito/${encodeURIComponent(usuario.email)}/agregar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ producto })
        });

        if (response.ok) {
          const data = await response.json();
          setCarrito(data.items || []);
        }
      } catch (error) {
        console.error('Error agregando al carrito:', error);
      }
    } else {
      setCarrito([...carrito, producto]);
    }

    alert(`¡${producto.nombre} agregado al carrito!`);
  };

  const eliminarDelCarrito = async (index) => {
    if (usuario && usuario.tipo === 'cliente' && usuario.email) {
      try {
        const response = await fetch(`http://localhost:4000/api/carrito/${encodeURIComponent(usuario.email)}/index/${index}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          const data = await response.json();
          setCarrito(data.items || []);
        }
      } catch (error) {
        console.error('Error eliminando del carrito:', error);
      }
    } else {
      setCarrito(carrito.filter((_, i) => i !== index));
    }
  };

  const limpiarCarrito = async () => {
    if (usuario && usuario.tipo === 'cliente' && usuario.email) {
      try {
        const response = await fetch(`http://localhost:4000/api/carrito/${encodeURIComponent(usuario.email)}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          const data = await response.json();
          setCarrito(data.items || []);
        }
      } catch (error) {
        console.error('Error vaciando carrito:', error);
      }
    } else {
      setCarrito([]);
    }
  };

  const esFavorito = (producto) => {
    const productoId = String(producto.id || producto._id || producto.productoId || '');
    return favoritos.some(item => String(item.productoId) === productoId);
  };

  const toggleFavorito = async (producto) => {
    if (!usuario || usuario.tipo !== 'cliente' || !usuario.email) {
      alert('Inicia sesión como cliente para usar favoritos');
      return;
    }

    const productoId = String(producto.id || producto._id || producto.productoId || '');

    try {
      if (esFavorito(producto)) {
        const response = await fetch(`http://localhost:4000/api/favoritos/${encodeURIComponent(usuario.email)}/${encodeURIComponent(productoId)}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          const data = await response.json();
          setFavoritos(data.items || []);
        }
      } else {
        const response = await fetch(`http://localhost:4000/api/favoritos/${encodeURIComponent(usuario.email)}/agregar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ producto })
        });
        if (response.ok) {
          const data = await response.json();
          setFavoritos(data.items || []);
        }
      }
    } catch (error) {
      console.error('Error actualizando favoritos:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (email) {
        await fetch(`${API_BASE_URL}/api/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
    
    // Limpiar localStorage y estado
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    localStorage.removeItem('adminToken');
    setUsuario(null);
    setCarrito([]);
    setFavoritos([]);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar cantidadCarrito={carrito.length} cantidadFavoritos={favoritos.length} usuario={usuario} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/" element={<Home agregarAlCarrito={agregarAlCarrito} favoritos={favoritos} toggleFavorito={toggleFavorito} />} />
          <Route path="/producto/:id" element={<ProductoDetalle agregarAlCarrito={agregarAlCarrito} favoritos={favoritos} toggleFavorito={toggleFavorito} />} />
          <Route path="/favoritos" element={<Favoritos favoritos={favoritos} toggleFavorito={toggleFavorito} agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/carrito" element={<Carrito carrito={carrito} eliminarDelCarrito={eliminarDelCarrito} limpiarCarrito={limpiarCarrito} />} />
          <Route path="/login" element={<Login onLogin={setUsuario} />} />
          <Route path="/registro" element={<Registro onLogin={setUsuario} />} />
          <Route path="/forgot-password" element={<OlvidarContraseña />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/pagar" element={<Pago carrito={carrito} usuario={usuario} limpiarCarrito={limpiarCarrito} />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
          <Route path="/pago-realizado" element={<PagoRealizado />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/categorias" element={<GestionCategorias />} />
        </Routes>

        <footer>
          <div className="footer-content">
            <div className="footer-info">
              <p>Librería Emelyn © 2026 - Yapeyú, Corrientes</p>
            </div>
            <div className="footer-social">
              <a 
                href="https://www.instagram.com/libreriaemelyn/" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Seguinos en Instagram"
                className="social-icon"
              >
                📷
              </a>
              <a 
                href="https://wa.me/543772402029" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Contactanos por WhatsApp"
                className="social-icon"
              >
                💬
              </a>
            </div>
          </div>
        </footer>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
