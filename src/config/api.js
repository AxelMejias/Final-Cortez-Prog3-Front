// Configuración del backend
const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:4000' : 'https://final-cortez-prog3-back.onrender.com');

export default API_BASE_URL;

