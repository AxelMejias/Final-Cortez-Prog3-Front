import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import API_BASE_URL from '../config/api';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || `Error del servidor (${response.status})`);
        setLoading(false);
        return;
      }

      if (!data.success) {
        setError('Email o contraseña inválidos');
        setLoading(false);
        return;
      }

      // Guardar datos del usuario en localStorage
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userData', JSON.stringify(data.usuario || data.admin));

      if (data.tipo === 'admin') {
        // Si es admin, guardar el token y redirigir a /admin
        localStorage.setItem('adminToken', 'logged-in');
        onLogin(data.admin);
        navigate('/admin');
      } else {
        // Si es cliente, redirigir a home
        onLogin(data.usuario);
        navigate('/');
      }

      setLoading(false);
    } catch (err) {
      setError('Error al conectar con el servidor: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>🔐 Iniciar Sesión</h2>
        <p className="login-subtitle">Accede a tu cuenta en Librería Emelyn</p>
        
        {error && <div className="error-mensaje">{error}</div>}

        <form onSubmit={handleSubmit} className="formulario-login">
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
              placeholder="Ingresa tu contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-accion btn-login" disabled={loading}>
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
          <p><Link to="/forgot-password" style={{ color: '#d32f2f', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
