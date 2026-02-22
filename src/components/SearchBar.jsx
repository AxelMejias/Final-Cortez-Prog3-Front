import { useState, useEffect } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchQuery}
        onChange={handleChange}
        className="search-input"
      />
      {searchQuery && (
        <button
          type="button"
          className="search-clear"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
      <button type="submit" className="search-btn">
        🔍
      </button>
    </form>
  );
}
