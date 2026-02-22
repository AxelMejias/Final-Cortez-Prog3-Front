import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

export default function Breadcrumbs({ items = [] }) {
  // items debe ser un array como: [{ label: 'Inicio', path: '/' }, { label: 'Escolar', path: '/?categoria=Escolar' }, { label: 'Cuaderno' }]
  
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumbs-item">
            {item.path ? (
              <>
                <Link to={item.path} className="breadcrumbs-link">
                  {item.label}
                </Link>
                {index < items.length - 1 && <span className="breadcrumbs-separator">/</span>}
              </>
            ) : (
              <>
                <span className="breadcrumbs-text">{item.label}</span>
                {index < items.length - 1 && <span className="breadcrumbs-separator">/</span>}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
