import { useState } from 'react';
import './ProductFilters.css';

export default function ProductFilters({ onFilterChange, categorias = [] }) {
  const [filters, setFilters] = useState({
    categoria: '',
    precioMin: '',
    precioMax: '',
    conStock: false,
    sort: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = {
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleReset = () => {
    const resetFilters = {
      categoria: '',
      precioMin: '',
      precioMax: '',
      conStock: false,
      sort: ''
    };
    setFilters(resetFilters);
    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
  };

  return (
    <aside className="product-filters">
      <div className="filters-header">
        <h3>Filtros</h3>
        <button onClick={handleReset} className="reset-btn">
          Limpiar todos
        </button>
      </div>

      {/* Filtro por Categoría */}
      <div className="filter-group">
        <label htmlFor="categoria">Categoría</label>
        <select
          id="categoria"
          name="categoria"
          value={filters.categoria}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro por Rango de Precio */}
      <div className="filter-group">
        <label>Rango de Precio</label>
        <div className="price-inputs">
          <input
            type="number"
            name="precioMin"
            placeholder="Mín"
            value={filters.precioMin}
            onChange={handleChange}
            className="filter-input"
            min="0"
          />
          <span className="separator">-</span>
          <input
            type="number"
            name="precioMax"
            placeholder="Máx"
            value={filters.precioMax}
            onChange={handleChange}
            className="filter-input"
            min="0"
          />
        </div>
      </div>

      {/* Filtro por Stock */}
      <div className="filter-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="conStock"
            checked={filters.conStock}
            onChange={handleChange}
          />
          <span>Solo con stock</span>
        </label>
      </div>

      {/* Ordenamiento */}
      <div className="filter-group">
        <label htmlFor="sort">Ordenar por</label>
        <select
          id="sort"
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">Más recientes</option>
          <option value="nombre_asc">Nombre (A-Z)</option>
          <option value="nombre_desc">Nombre (Z-A)</option>
          <option value="precio_asc">Precio (menor a mayor)</option>
          <option value="precio_desc">Precio (mayor a menor)</option>
        </select>
      </div>
    </aside>
  );
}
