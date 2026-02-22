import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';

export default function OlvidarContraseña() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        if (!email.trim()) {
            setError('Por favor ingresa tu email');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(\\/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setMensaje('Se ha enviado un enlace de recuperación a tu email (si la cuenta existe)');
                setEmail('');
                // Redirigir a login después de 3 segundos
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(data.error || 'Error al procesar la solicitud');
            }
        } catch (err) {
            setError('Error de conexión: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h2>Recuperar Contraseña</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">Email: </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '5px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {error && (
                    <div style={{
                        color: '#d32f2f',
                        padding: '10px',
                        marginBottom: '15px',
                        backgroundColor: '#ffebee',
                        borderRadius: '4px'
                    }}>
                        {error}
                    </div>
                )}

                {mensaje && (
                    <div style={{
                        color: '#388e3c',
                        padding: '10px',
                        marginBottom: '15px',
                        backgroundColor: '#e8f5e9',
                        borderRadius: '4px'
                    }}>
                        {mensaje}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: loading ? '#ccc' : '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'default' : 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {loading ? 'Procesando...' : 'Enviar enlace de recuperación'}
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                    Volver a Login
                </Link>
            </div>
        </div>
    );
}
