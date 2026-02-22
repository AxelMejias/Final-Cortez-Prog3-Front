import './Pagination.css';

export default function Pagination({ paginacion, onPageChange }) {
  if (!paginacion || paginacion.totalPaginas <= 1) {
    return null;
  }

  const pages = [];
  const { pagina, totalPaginas } = paginacion;

  // Mostrar números de página alrededor de la actual
  const startPage = Math.max(1, pagina - 2);
  const endPage = Math.min(totalPaginas, pagina + 2);

  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) pages.push('...');
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPaginas) {
    if (endPage < totalPaginas - 1) pages.push('...');
    pages.push(totalPaginas);
  }

  return (
    <nav className="pagination">
      <button
        onClick={() => onPageChange(pagina - 1)}
        disabled={pagina === 1}
        className="pagination-btn prev-btn"
        aria-label="Página anterior"
      >
        ← Anterior
      </button>

      <div className="pagination-numbers">
        {pages.map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...' || page === pagina}
            className={`pagination-page ${page === pagina ? 'active' : ''} ${
              page === '...' ? 'ellipsis' : ''
            }`}
            aria-label={`Página ${page}`}
            aria-current={page === pagina ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(pagina + 1)}
        disabled={pagina === totalPaginas}
        className="pagination-btn next-btn"
        aria-label="Página siguiente"
      >
        Siguiente →
      </button>

      <span className="pagination-info">
        Página {pagina} de {totalPaginas}
      </span>
    </nav>
  );
}
