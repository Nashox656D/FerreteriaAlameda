import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryUsername, setRecoveryUsername] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(API_URL + 'auth/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Credenciales incorrectas');
      const data = await res.json();
      const userRes = await fetch(API_URL + 'user/', {
        headers: { 'Authorization': `Token ${data.token}` }
      });
      const user = await userRes.json();
      const usuarioObj = { token: data.token, username: user.username, is_superuser: user.is_superuser, cargo: user.cargo };
      try { localStorage.setItem('ticashop_token', data.token); } catch (e) { /* ignore */ }
      onLogin(usuarioObj);
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    setRecoveryMessage('');
    setError('');
    try {
      // Usar flujo con solicitud administrada: crear una SolicitudRecuperacion
      const res = await fetch(API_URL + 'recuperacion/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: recoveryUsername })
      });
      if (!res.ok) throw new Error('No se pudo enviar la solicitud');
      setRecoveryMessage('Solicitud enviada. Un administrador la procesará.');
      setRecoveryUsername('');
      setTimeout(() => setShowRecovery(false), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: '40px'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            marginBottom: '8px', 
            color: '#1a1a1a',
            fontWeight: '600'
          }}>🏗️ Ferreteria Alameda</h1>
          <p style={{ 
            fontSize: '14px', 
            color: '#666', 
            marginBottom: '40px' 
          }}>Sistema de Gestión de Inventario y Facturas</p>
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                color: '#333',
                fontWeight: '500'
              }}>Usuario</label>
              <input
                type="text"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00bfa5'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                color: '#333',
                fontWeight: '500'
              }}>Contraseña</label>
              <input
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00bfa5'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
            
            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#00bfa5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#009688'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#00bfa5'}
            >
              Iniciar Sesión
            </button>
            
            {error && (
              <div style={{ 
                color: '#c62828', 
                marginTop: '16px', 
                fontSize: '14px',
                backgroundColor: '#ffebee',
                padding: '12px',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button 
                type="button"
                onClick={() => setShowRecovery(!showRecovery)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#00bfa5',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>

          {showRecovery && (
            <div style={{
              marginTop: '24px',
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#333' }}>Recuperar Contraseña</h3>
              <form onSubmit={handleRecoverySubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px', 
                    color: '#333',
                    fontWeight: '500'
                  }}>Usuario</label>
                  <input
                    type="text"
                    placeholder="Ingrese su usuario"
                    value={recoveryUsername}
                    onChange={e => setRecoveryUsername(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '14px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <button 
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#ff9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Enviar Solicitud
                </button>
                {recoveryMessage && (
                  <div style={{ 
                    color: '#2e7d32', 
                    marginTop: '12px', 
                    fontSize: '14px',
                    backgroundColor: '#e8f5e9',
                    padding: '12px',
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    {recoveryMessage}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>

      <div style={{
        flex: 1,
        backgroundImage: `url(/tech-store.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 191, 165, 0.3)'
        }}></div>
      </div>
    </div>
  );
}

export default Login;
