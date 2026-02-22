import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProductFilters from '../components/ProductFilters';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import { showToast } from '../utils/toast';
import API_BASE_URL from '../config/api';

function Home({ agregarAlCarrito, favoritos, toggleFavorito }) {
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [paginacion, setPaginacion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Estado de filtros - inicializar desde URL para evitar race condition
  const getInitialFilters = () => {
    const params = new URLSearchParams(location.search);
    return {
      q: params.get('q') || '',
      categoria: params.get('categoria') || '',
      precioMin: '',
      precioMax: '',
      conStock: false,
      sort: ''
    };
  };
  const [filters, setFilters] = useState(getInitialFilters);
  const [pagina, setPagina] = useState(1);

  // Actualizar filtros cuando la URL cambia (navegación interna)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qParam = params.get('q') || '';
    const catParam = params.get('categoria') || '';
    setFilters(prev => {
      if (prev.q === qParam && prev.categoria === catParam) return prev;
      return { ...prev, q: qParam, categoria: catParam };
    });
  }, [location.search]);

  const esFavorito = (prod) => {
    const id = String(prod.id || prod._id || '');
    return favoritos.some(item => String(item.productoId) === id);
  };

  // Extraer categorías únicas con un GET inicial
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/productos?limit=1000`);
        if (response.ok) {
          const data = await response.json();
          const cats = [...new Set(data.productos.map(p => p.categoria))].filter(Boolean);
          setCategorias(cats);
        }
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    };
    fetchCategorias();
  }, []);

  // Fetch productos con filtros
  const fetchProductos = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.q) params.append('q', filters.q);
      if (filters.categoria) params.append('categoria', filters.categoria);
      if (filters.precioMin) params.append('precioMin', filters.precioMin);
      if (filters.precioMax) params.append('precioMax', filters.precioMax);
      if (filters.conStock) params.append('conStock', 'true');
      if (filters.sort) params.append('sort', filters.sort);
      params.append('page', pageNum);
      params.append('limit', 12);

      const response = await fetch(`${API_BASE_URL}/api/productos?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProductos(data.productos || []);
        setPaginacion(data.paginacion);
        setPagina(pageNum);
      } else {
        showToast.error('Error al cargar productos');
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
      showToast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos al cambiar filtros
  useEffect(() => {
    fetchProductos(1);
  }, [filters]);

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, q: query }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    fetchProductos(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAgregarAlCarrito = (prod) => {
    agregarAlCarrito(prod);
    showToast.success('Producto agregado al carrito');
  };

  return (
    <>
      <main className="home-main">
        <div className="home-header">
          <h2 className="titulo-seccion">Nuestros Productos</h2>
          <SearchBar onSearch={handleSearch} initialValue={filters.q} />
        </div>

        <div className="home-content">
          <aside>
            <ProductFilters onFilterChange={handleFilterChange} categorias={categorias} />
          </aside>

          <section className="productos-section">
            {loading ? (
              <Loading fullScreen={true} message="Cargando productos..." />
            ) : productos.length === 0 ? (
              <div className="no-productos">
                <p>No hay productos que coincidan con tu búsqueda.</p>
                <button
                  onClick={() => {
                    setFilters({
                      q: '',
                      categoria: '',
                      precioMin: '',
                      precioMax: '',
                      conStock: false,
                      sort: ''
                    });
                  }}
                  className="btn-reset-search"
                >
                  Limpiar búsqueda
                </button>
              </div>
            ) : (
              <>
                <div className="grid-productos">
                  {productos.map(prod => (
                    <div key={prod.id || prod._id} className="card">
                      <Link to={`/producto/${prod.id || prod._id}`} className="card-imagen-link">
                        <div className="img-container">
                          <img src={prod.imagen} alt={prod.nombre} />
                          {prod.stock <= 0 && <div className="stock-badge">AGOTADO</div>}
                        </div>
                      </Link>
                      <div className="card-info">
                        <span className="categoria-tag">{prod.categoria}</span>
                        <h3>{prod.nombre}</h3>
                        <div className="precio-row">
                          <p className="precio">${prod.precio}</p>
                          <div className="acciones-card">
                            <button
                              onClick={() => toggleFavorito(prod)}
                              className={`btn-favorito ${esFavorito(prod) ? 'activo' : ''}`}
                              title="Favorito"
                            >
                              {esFavorito(prod) ? '❤️' : '🖤'}
                            </button>
                            <button
                              onClick={() => handleAgregarAlCarrito(prod)}
                              className="btn-agregar"
                              disabled={prod.stock <= 0}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <Link to={`/producto/${prod.id || prod._id}`} className="btn-ver-detalle">
                          Ver Detalle
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <Pagination paginacion={paginacion} onPageChange={handlePageChange} />

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                  <Link to="/carrito" className="btn-accion">
                    Ir al Carrito 🛒
                  </Link>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default Home;
