function Logo() {
  return (
    <svg width="140" height="90" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Texto "librería" */}
      <text x="100" y="30" fontFamily="Montserrat, sans-serif" fontSize="16" fontWeight="700" fill="#E63946" textAnchor="middle" letterSpacing="3">
        LIBRERÍA
      </text>
      
      {/* Arco superior gris */}
      <path d="M 60 50 Q 100 30 140 50" stroke="#1D1D1D" strokeWidth="12" fill="none" strokeLinecap="round"/>
      
      {/* Techo amarillo del edificio */}
      <polygon points="100,50 85,70 115,70" fill="#FFC107"/>
      
      {/* Ventana/puerta del edificio (linea vertical) */}
      <rect x="97" y="70" width="6" height="20" fill="#1D1D1D"/>
      
      {/* Franjas rojas del edificio */}
      <rect x="80" y="72" width="8" height="16" fill="#E63946" rx="1"/>
      <rect x="100" y="72" width="8" height="16" fill="#E63946" rx="1"/>
      <rect x="112" y="72" width="8" height="16" fill="#E63946" rx="1"/>
      
      {/* Hojas izquierda */}
      <g>
        <ellipse cx="70" cy="85" rx="8" ry="14" fill="#E63946" transform="rotate(-40 70 85)"/>
        <ellipse cx="65" cy="95" rx="8" ry="14" fill="#E63946" transform="rotate(-25 65 95)"/>
        <ellipse cx="60" cy="105" rx="8" ry="14" fill="#E63946" transform="rotate(-10 60 105)"/>
      </g>
      
      {/* Hojas derecha */}
      <g>
        <ellipse cx="130" cy="85" rx="8" ry="14" fill="#E63946" transform="rotate(40 130 85)"/>
        <ellipse cx="135" cy="95" rx="8" ry="14" fill="#E63946" transform="rotate(25 135 95)"/>
        <ellipse cx="140" cy="105" rx="8" ry="14" fill="#E63946" transform="rotate(10 140 105)"/>
      </g>
      
      {/* Texto "Emelyn" en cursiva */}
      <text x="100" y="115" fontFamily="Dancing Script, cursive" fontSize="32" fontWeight="700" fill="#1D1D1D" textAnchor="middle">
        Emelyn
      </text>
    </svg>
  );
}

export default Logo;
