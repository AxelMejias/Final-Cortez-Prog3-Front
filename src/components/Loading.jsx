import './Loading.css';

export default function Loading({ fullScreen = false, message = 'Cargando...' }) {
  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <div className="spinner-small"></div>
      <span>{message}</span>
    </div>
  );
}
