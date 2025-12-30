import React, { useEffect, useState } from 'react';
import { validarNombre, validarRUT, validarEmail, validarUsername, validarPassword, formatearRUT } from './utils/validations';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';

function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', rut: '', email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [activeTab, setActiveTab] = useState('list'); // 'list' o 'create'

  const cargarClientes = () => {
    const token = localStorage.getItem('ticashop_token');
    const headers = token ? { 'Authorization': `Token ${token}` } : {};

    return fetch(API_URL + 'clientes/', { headers })
      .then(r => {
        if (!r.ok) {
          // Si no está autorizado, devolver lista vacía y mostrar mensaje opcional
          if (r.status === 401 || r.status === 403) {
            console.warn('No autorizado para ver clientes:', r.status);
            setClientes([]);
            return [];
          }
          throw new Error('Error al obtener clientes');
        }
        return r.json();
      })
      .then(data => {
        console.log('Clientes cargados:', data);
        setClientes(data);
        return data;
      })
      .catch(err => {
        console.error('Error cargando clientes:', err);
        setError('No se pudieron cargar los clientes.');
      });
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleClienteChange = e => {
    const { name, value } = e.target;
    let newValue = value;
    
    // Formatear RUT automáticamente mientras se escribe
    if (name === 'rut') {
      newValue = formatearRUT(value);
    }
    
    setNuevoCliente({ ...nuevoCliente, [name]: newValue });
    
    // Limpiar error de validación al escribir
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const handleClienteSubmit = async e => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    
    // Validar campos
    const nombreValidation = validarNombre(nuevoCliente.nombre);
    const rutValidation = validarRUT(nuevoCliente.rut);
    const emailValidation = validarEmail(nuevoCliente.email);
    
    const errors = {};
    if (!nombreValidation.valid) errors.nombre = nombreValidation.error;
    if (!rutValidation.valid) errors.rut = rutValidation.error;
    if (!emailValidation.valid) errors.email = emailValidation.error;

    const usernameValidation = validarUsername(nuevoCliente.username);
    const passwordValidation = validarPassword(nuevoCliente.password);

    if (!usernameValidation.valid) errors.username = usernameValidation.error;
    if (!passwordValidation.valid) errors.password = passwordValidation.error;
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {
      const token = localStorage.getItem('ticashop_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Token ${token}`;

      const res = await fetch(API_URL + 'clientes/', {
        method: 'POST',
        headers,
        body: JSON.stringify(nuevoCliente)
      });
      if (!res.ok) {
        const errorData = await res.json();
        
        if (errorData.rut) {
          setValidationErrors({ rut: errorData.rut[0] || 'RUT duplicado o inválido' });
          return;
        }
        if (errorData.user) {
          setError(errorData.user);
          return;
        }
        if (errorData.username) {
          setValidationErrors({ username: 'Este nombre de usuario ya existe' });
          return;
        }
        
        throw new Error(errorData.detail || 'Error al crear cliente');
      }
      
      await res.json();
      // Recargar lista completa desde servidor
      cargarClientes();
      setNuevoCliente({ nombre: '', rut: '', email: '', username: '', password: '' });
      setSuccess('Cliente creado exitosamente');
      setError('');
      setValidationErrors({});
      setActiveTab('list');
    } catch (err) {
      setError(err.message || 'Error al crear cliente');
    }
  };

  const descargarExcel = () => {
    const token = localStorage.getItem('ticashop_token');
    const headers = token ? { 'Authorization': `Token ${token}` } : {};
    
    fetch(API_URL + 'clientes/descargar_excel/', { headers })
      .then(response => {
        if (!response.ok) throw new Error('Error al descargar');
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Clientes_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(err => setError('Error al descargar el archivo Excel'));
  };

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>👥 Clientes</h2>
        <button 
          onClick={descargarExcel}
          style={{ 
            background: '#10b981', 
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem'
          }}
        >
          📥 Descargar Excel
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 24, borderBottom: '2px solid #f3e8ff', display: 'flex' }}>
        <button 
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'list' ? '3px solid #a855f7' : '3px solid transparent',
            color: activeTab === 'list' ? '#a855f7' : '#6b7280',
            fontWeight: activeTab === 'list' ? '600' : '500',
            cursor: 'pointer',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease'
          }}
        >
          📋 Ver Clientes
        </button>
        <button 
          className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'create' ? '3px solid #a855f7' : '3px solid transparent',
            color: activeTab === 'create' ? '#a855f7' : '#6b7280',
            fontWeight: activeTab === 'create' ? '600' : '500',
            cursor: 'pointer',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease'
          }}
        >
          ➕ Agregar Cliente
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'list' && (
        <div>
          {error && <div className="error-message" style={{ marginBottom: 16 }}>{error}</div>}
          {success && <div style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: 'left 4px solid #10b981', color: '#065f46', padding: '12px 16px', borderRadius: '8px', marginBottom: 16, fontWeight: '500' }}>{success}</div>}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>RUT</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.nombre}</td>
                    <td>{c.rut}</td>
                    <td>{c.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="card">
          <h3>Crear Nuevo Cliente</h3>
          <form onSubmit={handleClienteSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Nombre *</label>
              <input 
                name="nombre" 
                placeholder="Nombre completo (sin números)" 
                value={nuevoCliente.nombre} 
                onChange={handleClienteChange}
                style={{ borderColor: validationErrors.nombre ? '#ef4444' : undefined, width: '100%' }}
              />
              {validationErrors.nombre && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 4 }}>{validationErrors.nombre}</div>}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>RUT *</label>
              <input 
                name="rut" 
                placeholder="RUT (12345678-9)" 
                value={nuevoCliente.rut} 
                onChange={handleClienteChange}
                style={{ borderColor: validationErrors.rut ? '#ef4444' : undefined, width: '100%' }}
              />
              {validationErrors.rut && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 4 }}>{validationErrors.rut}</div>}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Email *</label>
              <input 
                name="email" 
                type="email"
                placeholder="correo@ejemplo.com" 
                value={nuevoCliente.email} 
                onChange={handleClienteChange}
                style={{ borderColor: validationErrors.email ? '#ef4444' : undefined, width: '100%' }}
              />
              {validationErrors.email && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 4 }}>{validationErrors.email}</div>}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Usuario *</label>
              <input 
                name="username" 
                placeholder="Nombre de usuario" 
                value={nuevoCliente.username} 
                onChange={handleClienteChange}
                style={{ borderColor: validationErrors.username ? '#ef4444' : undefined, width: '100%' }}
              />
              {validationErrors.username && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 4 }}>{validationErrors.username}</div>}
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Contraseña *</label>
              <input 
                name="password" 
                type="password"
                placeholder="Contraseña" 
                value={nuevoCliente.password} 
                onChange={handleClienteChange}
                style={{ borderColor: validationErrors.password ? '#ef4444' : undefined, width: '100%' }}
              />
              {validationErrors.password && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 4 }}>{validationErrors.password}</div>}
            </div>
            {error && <div className="error-message" style={{ marginBottom: 16 }}>{error}</div>}
            <button type="submit" style={{ width: '100%' }}>➕ Agregar Cliente</button>
          </form>
        </div>
      )}
    </section>
  );
}

export default ClientesPage;