import { useState, useEffect } from 'react';
import { showToast } from '../utils/toast';
import API_BASE_URL from '../config/api';
import Loading from './Loading';
import './GestionCategorias.css';

export default function GestionCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [editando, setEditando] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState('');

  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/categorias`);
      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
      } else {
        showToast.error('Error al cargar categorías');
      }
    } catch (error) {
      console.error(error);
      showToast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    
    if (!nuevaCategoria.trim()) {
      showToast.error('El nombre de la categoría es requerido');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/categorias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'admin-secret-123'
        },
        body: JSON.stringify({ nombre: nuevaCategoria })
      });

      if (response.ok) {
        showToast.success('Categoría creada');
        setNuevaCategoria('');
        cargarCategorias();
      } else {
        const error = await response.json();
        showToast.error(error.error || 'Error al crear categoría');
      }
    } catch (error) {
      console.error(error);
      showToast.error('Error al crear categoría');
    }
  };

  const handleEditar = (categoria) => {
    setEditando(categoria);
    setNuevoNombre(categoria);
  };

  const handleGuardar = async () => {
    if (!nuevoNombre.trim()) {
      showToast.error('El nombre es requerido');
      return;
    }

    if (nuevoNombre === editando) {
      showToast.info('No hay cambios');
      setEditando(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/categorias/${encodeURIComponent(editando)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'admin-secret-123'
        },
        body: JSON.stringify({ nuevo: nuevoNombre })
      });

      if (response.ok) {
        const data = await response.json();
        showToast.success(`Categoría actualizada: ${data.productosActualizados} productos`,);
        setEditando(null);
        cargarCategorias();
      } else {
        const error = await response.json();
        showToast.error(error.error || 'Error al actualizar');
      }
    } catch (error) {
      console.error(error);
      showToast.error('Error al actualizar categoría');
    }
  };

  const handleEliminar = async (categoria) => {
    if (!window.confirm(`¿Eliminar categoría "${categoria}"? Los productos se moverán a "Sin Categoría"`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/categorias/${encodeURIComponent(categoria)}`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': 'admin-secret-123'
        }
      });

      if (response.ok) {
        const data = await response.json();
        showToast.success(`Categoría eliminada: ${data.productosAfectados} productos reubicados`);
        cargarCategorias();
      } else {
        const error = await response.json();
        showToast.error(error.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error(error);
      showToast.error('Error al eliminar categoría');
    }
  };

  if (loading) {
    return <Loading fullScreen message="Cargando categorías..." />;
  }

  return (
    <div className="gestion-categorias">
      <h2>Gestión de Categorías</h2>

      <div className="crear-categoria">
        <form onSubmit={handleCrear}>
          <input
            type="text"
            placeholder="Nombre de nueva categoría"
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            className="input-categoria"
          />
          <button type="submit" className="btn-crear">
            + Crear
          </button>
        </form>
      </div>

      <div className="tabla-categorias">
        {categorias.length === 0 ? (
          <p className="sin-categorias">No hay categorías</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat) => (
                <tr key={cat}>
                  <td>
                    {editando === cat ? (
                      <input
                        type="text"
                        value={nuevoNombre}
                        onChange={(e) => setNuevoNombre(e.target.value)}
                        autoFocus
                        className="input-editar"
                      />
                    ) : (
                      cat
                    )}
                  </td>
                  <td className="acciones">
                    {editando === cat ? (
                      <>
                        <button onClick={handleGuardar} className="btn-guardar">
                          ✓ Guardar
                        </button>
                        <button
                          onClick={() => setEditando(null)}
                          className="btn-cancelar"
                        >
                          ✕ Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditar(cat)}
                          className="btn-editar"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(cat)}
                          className="btn-eliminar"
                        >
                          🗑️ Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
