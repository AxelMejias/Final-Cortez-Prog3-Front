import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import Breadcrumbs from '../components/Breadcrumbs';
import ImageZoom from '../components/ImageZoom';
import Loading from '../components/Loading';
import { showToast } from '../utils/toast';

function ProductoDetalle({ agregarAlCarrito, favoritos = [], toggleFavorito }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);

  const esFavorito = (prod) => {
    if (!prod) return false;
    const prodId = String(prod.id || prod._id || '');
    return favoritos.some(item => String(item.productoId) === prodId);
  };

  const handleToggleFavorito = () => {
    if (toggleFavorito) {
      const yaEsFav = esFavorito(producto);
      toggleFavorito(producto);
      showToast.success(yaEsFav ? 'Removido de favoritos' : 'Agregado a favoritos');
    }
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/productos`)
      .then(res => res.json())
      .then(data => {
        const productos = Array.isArray(data) ? data : data.productos || [];
        const prod = productos.find(p => String(p.id || p._id) === String(id));
        setProducto(prod);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/productos?limit=1000`);
        if (response.ok) {
          const data = await response.json();
          const productos = Array.isArray(data) ? data : data.productos || [];
          const cats = [...new Set(productos.map(p => p.categoria))].filter(Boolean);
          setCategorias(cats);
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    fetchCategorias();
  }, []);

  const handleGoToCategoria = (categoria) => {
    navigate(`/?q=${encodeURIComponent(categoria)}`);
  };

  const handleAgregar = () => {
    if (producto.stock <= 0) {
      showToast.error('Producto agotado');
      return;
    }
    for (let i = 0; i < cantidad; i++) {
      agregarAlCarrito(producto);
    }
    showToast.success(`${cantidad} ${cantidad === 1 ? 'producto' : 'productos'} agregado al carrito`);
    navigate('/carrito');
  };

  if (loading) {
    return <Loading fullScreen message="Cargando producto..." />;
  }

  if (!producto) {
    return (
      <div className="no-productos" style={{ padding: '100px 20px' }}>
        <p>Producto no encontrado</p>
        <Link to="/" className="btn-accion">Volver a inicio</Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Inicio', path: '/' },
    { label: producto.categoria, path: `/?categoria=${producto.categoria}` },
    { label: producto.nombre }
  ];

  const estaAgotado = producto.stock <= 0;

  return (
    <div className="producto-detalle">
      <div className="detalle-container">
      <aside className="sidebar-detalle">
        <Breadcrumbs items={breadcrumbItems} />
        <Link to="/" className="btn-volver">&larr; Volver</Link>
        <div className="sidebar-categorias">
          <h3>Categorías</h3>
          <div className="categorias-lista">
            {categorias.map((cat) => (
              <button
                key={cat}
                className={`categoria-item ${producto.categoria === cat ? 'activa' : ''}`}
                onClick={() => handleGoToCategoria(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </aside>

        <div className="detalle-main">
      <div className="detalle-contenido">
        <div className="detalle-imagen">
          <ImageZoom src={producto.imagen} alt={producto.nombre} simpleHover={true} />
        </div>

        <div className="detalle-info">
          <span className="categoria-tag">{producto.categoria}</span>
          <h1>{producto.nombre}</h1>
          
          <div className="detalle-precio">
            <p className="precio-grande">${producto.precio}</p>
            <span className={`stock-status ${estaAgotado ? 'agotado' : 'disponible'}`}>
              {estaAgotado ? 'Stock: Agotado ❌' : 'Stock: Disponible ✅'}
            </span>
          </div>

          <div className="detalle-descripcion">
            <h3>Descripción</h3>
            <p>Producto de calidad premium de nuestra librería Emelyn. Ideal para todo tipo de uso escolar y profesional.</p>
          </div>

          <div className="cantidad-selector">
            <label>Cantidad:</label>
            <div className="selector">
              <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} disabled={estaAgotado}>−</button>
              <input type="number" value={cantidad} readOnly />
              <button onClick={() => setCantidad(cantidad + 1)} disabled={estaAgotado}>+</button>
            </div>
            <button 
              onClick={handleToggleFavorito} 
              className={`btn-favorito-detalle ${esFavorito(producto) ? 'activo' : ''}`}
              title={esFavorito(producto) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              {esFavorito(producto) ? '❤️' : '🖤'}
            </button>
          </div>

          <div className="detalles-adicionales">
            <h3>Especificaciones</h3>
            <ul>
              <li>✓ Entrega en toda la provincia de Corrientes</li>
              <li>✓ Devolución hasta 15 días después</li>
              <li>✓ Garantía del producto</li>
              <li>✓ Envío seguro y rápido</li>
            </ul>
          </div>

          <button 
            onClick={handleAgregar} 
            className="btn-accion btn-comprar"
            disabled={estaAgotado}
          >
            {estaAgotado ? 'Producto Agotado' : `Agregar al Carrito (${cantidad})`}
          </button>
        </div>
      </div>
      </div>
    </div>
    </div>
  );
}

export default ProductoDetalle;
