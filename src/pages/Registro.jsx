import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import API_BASE_URL from '../config/api';

function Registro({ onLogin }) {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!nombre || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const registroResponse = await fetch(\\/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, password })
      });

      const registroData = await registroResponse.json();

      if (!registroResponse.ok) {
        setError(registroData.error || `Error del servidor (${registroResponse.status})`);
        setLoading(false);
        return;
      }

      const loginResponse = await fetch(\\/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok || !loginData.success) {
        setError('Registro exitoso, pero no se pudo iniciar sesión automáticamente');
        setLoading(false);
        return;
      }

      localStorage.setItem('userEmail', loginData.usuario.email);
      localStorage.setItem('userData', JSON.stringify(loginData.usuario));
      onLogin(loginData.usuario);

      setLoading(false);
      navigate('/');
    } catch (err) {
      setError('Error al conectar con el servidor: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>📝 Crear Cuenta</h2>
        <p className="login-subtitle">Regístrate para comprar en Librería Emelyn</p>

        {error && <div className="error-mensaje">{error}</div>}

        <form onSubmit={handleSubmit} className="formulario-login">
          <div className="form-grupo">
            <label>Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-grupo">
            <label>Correo Electrónico</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-grupo">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-grupo">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-accion btn-login" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="login-footer">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Registro;
