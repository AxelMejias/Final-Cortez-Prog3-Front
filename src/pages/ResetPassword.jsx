import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (!tokenParam) {
            setError('El enlace de recuperación es inválido o ha expirado');
        } else {
            setToken(tokenParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        if (!password || !confirmPassword) {
            setError('Por favor completa ambos campos de contraseña');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    newPassword: password,
                    confirmPassword
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setMensaje(data.mensaje);
                setPassword('');
                setConfirmPassword('');
                // Redirigir a login después de 2 segundos
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(data.error || 'Error al resetear contraseña');
            }
        } catch (err) {
            setError('Error de conexión: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (error && error.includes('inválido')) {
        return (
            <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
                <h2>Link Expirado o Inválido</h2>
                <p style={{ color: '#d32f2f', marginBottom: '20px' }}>{error}</p>
                <Link to="/forgot-password" style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px'
                }}>
                    Solicitar nuevo enlace
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h2>Resetear Contraseña</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password">Nueva Contraseña: </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        disabled={loading || !token}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '5px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="confirmPassword">Confirmar Contraseña: </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirma tu contraseña"
                        disabled={loading || !token}
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
                    disabled={loading || !token}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: (loading || !token) ? '#ccc' : '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: (loading || !token) ? 'default' : 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {loading ? 'Procesando...' : 'Actualizar Contraseña'}
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
