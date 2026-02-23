import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GestionCategorias from '../components/GestionCategorias';
import API_BASE_URL from '../config/api';

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [boletas, setBoletas] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [boletasUsuario, setBoletasUsuario] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [paginaAdmin, setPaginaAdmin] = useState(1);
  const productosPorPagina = 15;

  const adminData = JSON.parse(localStorage.getItem('userData') || '{}');

  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    imagen: '',
    descripcion: '',
    stock: ''
  });

  const [previewImagen, setPreviewImagen] = useState('');
  const [imagenFile, setImagenFile] = useState(null);
  const [uploadingImagen, setUploadingImagen] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/login');
      return;
    }
    cargarDatos();
  }, [navigate]);

  const cargarDatos = async () => {
    setLoading(true);
    setError('');

    // Cargar productos
    try {
      const respProductos = await fetch(`${API_BASE_URL}/api/productos?limit=500`);
      if (respProductos.ok) {
        const dataProductos = await respProductos.json();
        const listaProductos = Array.isArray(dataProductos)
          ? dataProductos
          : Array.isArray(dataProductos.productos)
            ? dataProductos.productos
            : [];
        setProductos(listaProductos);
      }
    } catch (err) {
      console.error('Error cargando productos:', err);
    }

    // Cargar usuarios
    try {
      const respUsuarios = await fetch(`${API_BASE_URL}/api/admin/usuarios`, {
        headers: { 'x-admin-token': 'admin-secret-123' }
      });
      if (respUsuarios.ok) {
        const dataUsuarios = await respUsuarios.json();
        setUsuarios(Array.isArray(dataUsuarios) ? dataUsuarios : []);
      }
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    }

    // Cargar boletas
    try {
      const respBoletas = await fetch(`${API_BASE_URL}/api/admin/boletas`, {
        headers: { 'x-admin-token': 'admin-secret-123' }
      });
      if (respBoletas.ok) {
        const dataBoletas = await respBoletas.json();
        setBoletas(Array.isArray(dataBoletas) ? dataBoletas : []);
      }
    } catch (err) {
      console.error('Error cargando boletas:', err);
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  // ===== GESTIÓN DE PRODUCTOS =====
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB límite
        setError('La imagen es muy grande. Máximo 5MB');
        return;
      }
      
      // Guardar archivo y mostrar preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target.result;
        setPreviewImagen(preview);
        setImagenFile(file);
        setFormData({ ...formData, imagen: '' }); // Vaciar URL hasta que se suba
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImagenACloudinary = async () => {
    if (!imagenFile) return null;

    try {
      setUploadingImagen(true);
      const formDataUpload = new FormData();
      formDataUpload.append('imagen', imagenFile);

      const response = await fetch(`${API_BASE_URL}/api/admin/upload-imagen`, {
        method: 'POST',
        headers: {
          'x-admin-token': 'admin-secret-123'
        },
        body: formDataUpload
      });

      if (!response.ok) {
        throw new Error('Error al subir imagen a Cloudinary');
      }

      const data = await response.json();
      setUploadingImagen(false);
      setImagenFile(null);
      return data.url;
    } catch (err) {
      setError('Error al subir imagen: ' + err.message);
      setUploadingImagen(false);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.categoria || !formData.precio) {
      setError('Por favor completa los campos obligatorios');
      return;
    }

    try {
      let imagenFinal = formData.imagen;

      // Si hay un archivo de imagen, subirlo a Cloudinary primero
      if (imagenFile) {
        imagenFinal = await uploadImagenACloudinary();
      }

      const datosProducto = {
        nombre: formData.nombre,
        categoria: formData.categoria,
        precio: parseFloat(formData.precio),
        imagen: imagenFinal || 'https://via.placeholder.com/200',
        descripcion: formData.descripcion || '',
        stock: parseInt(formData.stock) || 0
      };

      const url = editandoId 
        ? `${API_BASE_URL}/api/productos/${editandoId}`
        : `${API_BASE_URL}/api/productos`;

      const metodo = editandoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'admin-secret-123'
        },
        body: JSON.stringify(datosProducto)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al guardar producto (${response.status})`);
      }

      setFormData({
        nombre: '',
        categoria: '',
        precio: '',
        imagen: '',
        descripcion: '',
        stock: ''
      });
      setImagenFile(null);
      setEditandoId(null);
      setShowForm(false);
      setPreviewImagen('');
      cargarDatos();
      setError('');
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  const handleEditar = (producto) => {
    setFormData(producto);
    setEditandoId(producto.id || producto._id);
    setShowForm(true);
    setPreviewImagen(producto.imagen || '');
  };

  const handleEliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/productos/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': 'admin-secret-123' }
      });

      if (!response.ok) throw new Error('Error');
      cargarDatos();
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  const handleCancelar = () => {
    setShowForm(false);
    setEditandoId(null);
    setImagenFile(null);
    setFormData({
      nombre: '',
      categoria: '',
      precio: '',
      imagen: '',
      descripcion: '',
      stock: ''
    });
    setPreviewImagen('');
  };

  // ===== GESTIÓN DE USUARIOS =====
  const handleVerBoletasUsuario = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/usuarios/${encodeURIComponent(email)}/boletas`, {
        headers: { 'x-admin-token': 'admin-secret-123' }
      });

      if (!response.ok) throw new Error('Error al cargar boletas');
      
      const data = await response.json();
      setBoletasUsuario(data);
      setUsuarioSeleccionado(email);
      setActiveTab('boletas');
      setLoading(false);
    } catch (err) {
      setError('Error: ' + err.message);
      setLoading(false);
    }
  };

  const handleVolverAUsuarios = () => {
    setUsuarioSeleccionado(null);
    setBoletasUsuario([]);
    setActiveTab('usuarios');
  };

  // ===== GESTIÓN DE BOLETAS =====
  const handleCambiarEstadoBoleta = async (id, nuevoEstado) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/boletas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'admin-secret-123'
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!response.ok) throw new Error('Error');
      
      // Recargar boletas del usuario si está viendo boletas filtradas
      if (usuarioSeleccionado) {
        handleVerBoletasUsuario(usuarioSeleccionado);
      } else {
        cargarDatos();
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1>⚙️ Panel de Administración</h1>
          <p className="admin-user-info">👤 {adminData.nombre}</p>
        </div>
        <div className="admin-header-buttons">
          <Link to="/" className="btn-ver-tienda">
            🏠 Ver Tienda
          </Link>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      {error && <div className="error-mensaje admin-error">{error}</div>}
      {loading && <div className="loading-mensaje">⏳ Cargando...</div>}

      {/* TABS */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'productos' ? 'active' : ''}`}
          onClick={() => setActiveTab('productos')}
        >
          📦 Productos ({productos.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'usuarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('usuarios')}
        >
          👥 Usuarios ({usuarios.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'boletas' ? 'active' : ''}`}
          onClick={() => setActiveTab('boletas')}
        >
          📄 Boletas ({boletas.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'categorias' ? 'active' : ''}`}
          onClick={() => setActiveTab('categorias')}
        >
          🏷️ Categorías
        </button>
      </div>

      {/* TAB: PRODUCTOS */}
      {activeTab === 'productos' && (
        <div className="admin-content">
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)} 
              className="btn-accion btn-crear-producto"
            >
              ➕ Nuevo Producto
            </button>
          )}

          {showForm && (
            <div className="admin-form-container">
              <h2>{editandoId ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-row">
                  <div className="form-grupo">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Nombre del producto"
                      required
                    />
                  </div>
                  <div className="form-grupo">
                    <label>Categoría *</label>
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      <option value="Papeles">Papeles</option>
                      <option value="Escolar">Escolar</option>
                      <option value="Útiles">Útiles</option>
                      <option value="Mochilas">Mochilas</option>
                      <option value="Servicios">Servicios</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-grupo">
                    <label>Precio *</label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-grupo">
                    <label>Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="Cantidad disponible"
                    />
                  </div>
                </div>

                <div className="form-grupo">
                  <label>Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Descripción del producto"
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-grupo">
                  <label>Imagen del Producto</label>
                  <div className="imagen-upload-container">
                    <div className="imagen-options">
                      <div className="opcion-imagen">
                        <label className="label-archivo">
                          📁 Subir desde tu PC
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImagenChange}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>
                      <div className="opcion-separador">o</div>
                      <div className="opcion-imagen">
                        <input
                          type="url"
                          name="imagen"
                          value={formData.imagen}
                          onChange={handleInputChange}
                          placeholder="https://ejemplo.com/imagen.jpg"
                          className="input-url-imagen"
                        />
                      </div>
                    </div>
                    {previewImagen && (
                      <div className="preview-imagen">
                        <img src={previewImagen} alt="Preview" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-acciones">
                  <button type="submit" className="btn-accion btn-guardar" disabled={uploadingImagen}>
                    {uploadingImagen ? '⏳ Subiendo imagen...' : `💾 ${editandoId ? 'Actualizar' : 'Crear'}`}
                  </button>
                  <button type="button" onClick={handleCancelar} className="btn-cancelar">
                    ✕ Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="admin-tabla-container">
            <h2>Productos</h2>
            {productos.length === 0 ? (
              <p className="texto-vacio">No hay productos</p>
            ) : (
              <>
              <div className="tabla-responsive">
                <table className="admin-tabla">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos
                      .slice((paginaAdmin - 1) * productosPorPagina, paginaAdmin * productosPorPagina)
                      .map(producto => (
                      <tr key={producto.id || producto._id}>
                        <td>#{producto.id || producto._id}</td>
                        <td className="celda-nombre">{producto.nombre}</td>
                        <td><span className="badge-categoria">{producto.categoria}</span></td>
                        <td className="celda-precio">${producto.precio}</td>
                        <td>{producto.stock || 0}</td>
                        <td className="celda-acciones">
                          <button onClick={() => handleEditar(producto)} className="btn-editar">
                            ✏️
                          </button>
                          <button onClick={() => handleEliminarProducto(producto.id || producto._id)} className="btn-eliminar-admin">
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {productos.length > productosPorPagina && (
                <div className="admin-paginacion">
                  <button
                    onClick={() => setPaginaAdmin(p => Math.max(1, p - 1))}
                    disabled={paginaAdmin === 1}
                    className="btn-pag"
                  >
                    ← Anterior
                  </button>
                  {Array.from({ length: Math.ceil(productos.length / productosPorPagina) }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPaginaAdmin(i + 1)}
                      className={`btn-pag ${paginaAdmin === i + 1 ? 'btn-pag-activo' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPaginaAdmin(p => Math.min(Math.ceil(productos.length / productosPorPagina), p + 1))}
                    disabled={paginaAdmin === Math.ceil(productos.length / productosPorPagina)}
                    className="btn-pag"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB: USUARIOS */}
      {activeTab === 'usuarios' && (
        <div className="admin-content">
          <div className="admin-tabla-container">
            <h2>Historial de Usuarios</h2>
            <p className="subtitulo-usuarios">Haz clic en el email de un usuario para ver su historial de compras</p>
            {usuarios.length === 0 ? (
              <p className="texto-vacio">No hay usuarios con compras registradas</p>
            ) : (
              <div className="tabla-responsive">
                <table className="admin-tabla">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Total Comprado</th>
                      <th>Cantidad de Boletas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario, idx) => (
                      <tr 
                        key={idx} 
                        onClick={() => handleVerBoletasUsuario(usuario.email)}
                        className="fila-usuario-clickable"
                      >
                        <td>{usuario.nombre}</td>
                        <td className="email-usuario">
                          📧 {usuario.email}
                        </td>
                        <td className="celda-precio">${usuario.totalCompras}</td>
                        <td>
                          <span className="badge-boletas">
                            {usuario.cantidadBoletas} {usuario.cantidadBoletas === 1 ? 'compra' : 'compras'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: BOLETAS */}
      {activeTab === 'boletas' && (
        <div className="admin-content">
          <div className="admin-tabla-container">
            {usuarioSeleccionado ? (
              <>
                <div className="boletas-header">
                  <button onClick={handleVolverAUsuarios} className="btn-volver-usuarios">
                    ← Volver a Usuarios
                  </button>
                  <h2>Boletas de {usuarioSeleccionado}</h2>
                </div>
              </>
            ) : (
              <h2>Todas las Boletas</h2>
            )}
            
            {(usuarioSeleccionado ? boletasUsuario : boletas).length === 0 ? (
              <p className="texto-vacio">No hay boletas registradas</p>
            ) : (
              <div className="boletas-list">
                {(usuarioSeleccionado ? boletasUsuario : boletas).map(boleta => (
                  <div key={boleta.id || boleta._id} className="boleta-card">
                    <div className="boleta-header">
                      <div>
                        <h3>Boleta #{boleta.id || boleta._id}</h3>
                        <p className="boleta-cliente">{boleta.usuarioNombre} ({boleta.usuarioEmail})</p>
                      </div>
                      <div className="boleta-fecha">
                        {boleta.fecha} - {boleta.hora}
                      </div>
                    </div>

                    <div className="boleta-productos">
                      <h4>Productos:</h4>
                      <ul>
                        {boleta.productos.map((prod, idx) => (
                          <li key={idx}>
                            {prod.nombre} (x{prod.cantidad}) - ${prod.precio}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="boleta-footer">
                      <div className="boleta-total">
                        <strong>Total:</strong> ${boleta.total}
                      </div>
                      <div className="boleta-estado">
                        <select 
                          value={boleta.estado} 
                          onChange={(e) => handleCambiarEstadoBoleta(boleta.id || boleta._id, e.target.value)}
                          className={`estado-select estado-${boleta.estado.toLowerCase().replace(' ', '-')}`}
                        >
                          <option value="Procesando">Procesando</option>
                          <option value="En camino">En camino</option>
                          <option value="Entregado">Entregado</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: CATEGORÍAS */}
      {activeTab === 'categorias' && (
        <GestionCategorias />
      )}
    </div>
  );
}

export default Admin;
