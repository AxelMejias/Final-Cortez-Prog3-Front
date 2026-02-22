import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import API_BASE_URL from '../config/api';

function Pago({ carrito, usuario, limpiarCarrito }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    tarjeta: '',
    vencimiento: '',
    cvv: '',
    direccion: '',
    ciudad: '',
    codigoPostal: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const construirProductosBoleta = () => {
    const mapa = new Map();

    carrito.forEach((item) => {
      const key = String(item.id || item._id || item.productoId || item.nombre);
      if (!mapa.has(key)) {
        mapa.set(key, {
          nombre: item.nombre,
          cantidad: 1,
          precio: Number(item.precio)
        });
      } else {
        const actual = mapa.get(key);
        actual.cantidad += 1;
        mapa.set(key, actual);
      }
    });

    return Array.from(mapa.values());
  };
  
  const finalizarCompra = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.tarjeta || !formData.vencimiento || !formData.cvv) {
      setError('Por favor completa todos los campos de la tarjeta');
      return;
    }

    const userData = usuario || JSON.parse(localStorage.getItem('userData') || '{}');
    const userEmail = localStorage.getItem('userEmail') || userData.email;

    if (!userEmail) {
      setError('Debes iniciar sesión para completar la compra');
      return;
    }

    setLoading(true);

    try {
      const subtotal = carrito.reduce((sum, prod) => sum + prod.precio, 0);
      const total = subtotal + 500 + Math.round(subtotal * 0.21);

      const boletaResponse = await fetch(`${API_BASE_URL}/api/boletas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioEmail: userEmail,
          usuarioNombre: formData.nombre || userData.nombre || userEmail.split('@')[0],
          productos: construirProductosBoleta(),
          total
        })
      });

      const boletaData = await boletaResponse.json();

      if (!boletaResponse.ok) {
        throw new Error(boletaData.error || 'No se pudo registrar la compra');
      }

      await limpiarCarrito();
      navigate('/pago-realizado', { state: { boleta: boletaData.boleta } });
    } catch (err) {
      setError('Error al procesar compra: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="pago-vacio">
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos antes de pagar</p>
        <Link to="/" className="btn-accion">Volver al Inicio</Link>
      </div>
    );
  }

  const total = carrito.reduce((sum, prod) => sum + prod.precio, 0) + 500 + Math.round(carrito.reduce((sum, prod) => sum + prod.precio, 0) * 0.21);

  return (
    <div className="pago-container">
      <Link to="/carrito" className="btn-volver">&larr; Volver al Carrito</Link>
      
      <div className="pago-contenido">
        <div className="pago-form">
          <h2>💳 Finalizar Compra</h2>
          <p className="pago-subtitle">Completa tus datos de pago de forma segura</p>

          {error && <div className="error-mensaje">{error}</div>}

          <form onSubmit={finalizarCompra} className="formulario-pago">
            <h3>Datos Personales</h3>
            <div className="form-grupo">
              <label>Nombre Completo</label>
              <input 
                type="text" 
                name="nombre"
                placeholder="Juan Pérez" 
                value={formData.nombre}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-grupo">
              <label>Dirección</label>
              <input 
                type="text" 
                name="direccion"
                placeholder="Calle y número" 
                value={formData.direccion}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="fila-form">
              <div className="form-grupo" style={{flex: 1}}>
                <label>Ciudad</label>
                <input 
                  type="text" 
                  name="ciudad"
                  placeholder="Yapeyú" 
                  value={formData.ciudad}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-grupo" style={{flex: 1}}>
                <label>Código Postal</label>
                <input 
                  type="text" 
                  name="codigoPostal"
                  placeholder="3356" 
                  value={formData.codigoPostal}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <h3 style={{marginTop: '30px'}}>Datos de la Tarjeta</h3>
            
            <div className="form-grupo">
              <label>Nombre en la Tarjeta</label>
              <input 
                type="text" 
                name="tarjeta"
                placeholder="JUAN PEREZ" 
                value={formData.tarjeta}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-grupo">
              <label>Número de Tarjeta</label>
              <input 
                type="text" 
                name="numeroTarjeta"
                placeholder="4532 1234 5678 9010" 
                maxLength="19"
                required 
              />
            </div>

            <div className="fila-form">
              <div className="form-grupo" style={{flex: 1}}>
                <label>Vencimiento</label>
                <input 
                  type="text" 
                  name="vencimiento"
                  placeholder="MM/YY" 
                  value={formData.vencimiento}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-grupo" style={{flex: 1}}>
                <label>CVV</label>
                <input 
                  type="password" 
                  name="cvv"
                  placeholder="123" 
                  maxLength="3"
                  value={formData.cvv}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-accion btn-pagar"
              disabled={loading}
            >
              {loading ? 'Procesando...' : `Pagar $${total}`}
            </button>
          </form>
        </div>

        <div className="pago-resumen">
          <h3>Resumen de Compra</h3>
          <div className="items-resumen">
            {carrito.map((item, idx) => (
              <div key={idx} className="item-resumen-mini">
                <span>{item.nombre}</span>
                <span>${item.precio}</span>
              </div>
            ))}
          </div>
          <div className="total-resumen">
            <span>Total a Pagar:</span>
            <span className="monto">${total}</span>
          </div>
          <p className="seguridad">🔒 Tu pago está completamente seguro y encriptado</p>
        </div>
      </div>
    </div>
  );
}

export default Pago;
