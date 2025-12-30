import React, { useEffect, useState } from 'react';
import { validarRUT, validarEmail, formatearRUT } from './utils/validations';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';

function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);
  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
    direccion: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [activeTab, setActiveTab] = useState('list'); // 'list' o 'create'
  const [showTerminarModal, setShowTerminarModal] = useState(false);
  const [proveedorATerminar, setProveedorATerminar] = useState(null);
  const [comentarioTerminacion, setComentarioTerminacion] = useState('');
  const [motivoTerminacion, setMotivoTerminacion] = useState('cambio_proveedor');

  useEffect(() => {
    const token = localStorage.getItem('ticashop_token');
    const headers = token ? { 'Authorization': `Token ${token}` } : {};

    fetch(API_URL + 'proveedores/', { headers })
      .then(r => {
        if (!r.ok) {
          if (r.status === 401 || r.status === 403) {
            setProveedores([]);
            setError('No autorizado para ver proveedores.');
            return [];
          }
          throw new Error('Error al obtener proveedores');
        }
        return r.json();
      }).then(setProveedores)
      .catch(() => setError('No se pudieron cargar los proveedores.'));
  }, []);

  const handleProveedorChange = e => {
    const { name, value } = e.target;
    let newValue = value;
    
    // Formatear RUT automáticamente mientras se escribe
    if (name === 'rut') {
      newValue = formatearRUT(value);
    }
    
    setNuevoProveedor({ ...nuevoProveedor, [name]: newValue });
    
    // Limpiar error de validación al escribir
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const handleProveedorSubmit = async e => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    
    // Validar campos
    const rutValidation = validarRUT(nuevoProveedor.rut);
    const emailValidation = validarEmail(nuevoProveedor.email);
    
    const errors = {};
    if (!nuevoProveedor.nombre) errors.nombre = 'El nombre es requerido';
    if (!rutValidation.valid) errors.rut = rutValidation.error;
    if (!emailValidation.valid) errors.email = emailValidation.error;
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {
      const token = localStorage.getItem('ticashop_token');
      const headers = Object.assign({ 'Content-Type': 'application/json' }, token ? { 'Authorization': `Token ${token}` } : {});
      const res = await fetch(API_URL + 'proveedores/', {
        method: 'POST',
        headers,
        body: JSON.stringify(nuevoProveedor)
      });
      if (!res.ok) {
        const errorData = await res.json();
        
        if (errorData.rut) {
          setValidationErrors({ rut: errorData.rut[0] || 'RUT duplicado o inválido' });
          return;
        }
        if (errorData.email) {
          setValidationErrors({ email: errorData.email[0] || 'Email inválido' });
          return;
        }
        
        throw new Error(errorData.detail || 'Error al crear proveedor');
      }
      
      const prov = await res.json();
      setProveedores([...proveedores, prov]);
      setNuevoProveedor({ nombre: '', rut: '', email: '', telefono: '', direccion: '' });
      setSuccess('Proveedor creado exitosamente');
      setError('');
      setValidationErrors({});
      setActiveTab('list');
    } catch (err) {
      setError(err.message || 'Error al crear proveedor');
    }
  };

  const descargarExcel = () => {
    const token = localStorage.getItem('ticashop_token');
    const headers = token ? { 'Authorization': `Token ${token}` } : {};
    
    fetch(API_URL + 'proveedores/descargar_excel/', { headers })
      .then(response => {
        if (!response.ok) throw new Error('Error al descargar');
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Proveedores_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(err => setError('Error al descargar el archivo Excel'));
  };

  const abrirTerminarConvenio = (proveedor) => {
    setProveedorATerminar(proveedor);
    setComentarioTerminacion('');
    setMotivoTerminacion('cambio_proveedor');
    setShowTerminarModal(true);
  };

  const handleTerminarConvenio = async () => {
    if (!comentarioTerminacion.trim()) {
      setError('Debes ingresar un comentario para terminar el convenio');
      return;
    }

    try {
      const token = localStorage.getItem('ticashop_token');
      const headers = Object.assign({ 'Content-Type': 'application/json' }, token ? { 'Authorization': `Token ${token}` } : {});
      await fetch(API_URL + `proveedores/${proveedorATerminar.id}/`, {
        method: 'DELETE',
        headers
      });

      setProveedores(proveedores.filter(p => p.id !== proveedorATerminar.id));
      setSuccess(`Convenio con ${proveedorATerminar.nombre} finalizado correctamente`);
      setShowTerminarModal(false);
      setProveedorATerminar(null);
      setComentarioTerminacion('');
    } catch (err) {
      setError('Error al terminar el convenio');
    }
  };

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>🏢 Proveedores</h2>
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
          📋 Ver Proveedores
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
          ➕ Agregar Proveedor
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
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nombre}</td>
                    <td>{p.rut}</td>
                    <td>{p.email}</td>
                    <td>{p.telefono || '—'}</td>
                    <td>{p.direccion || '—'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => abrirTerminarConvenio(p)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                      >
                        ❌ Terminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="card">
          <h3>Crear Nuevo Proveedor</h3>
          <form onSubmit={handleProveedorSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Nombre *</label>
              <input 
                name="nombre" 
                placeholder="Nombre de la empresa" 
                value={nuevoProveedor.nombre} 
                onChange={handleProveedorChange}
                style={{ borderColor: validationErrors.nombre ? '#ef4444' : undefined, width: '100%' }}
              />
              {validationErrors.nombre && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 4 }}>{validationErrors.nombre}</div>}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>RUT *</label>
              <input 
                name="rut" 
                placeholder="RUT (12345678-9)" 
                value={nuevoProveedor.rut} 
                onChange={handleProveedorChange}
                style={{ borderColor: validationErrors.rut ? '#ef4444' : undefined, width: '100%' }}
              />
              {validationErrors.rut && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 4 }}>{validationErrors.rut}</div>}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Email *</label>
              <input 
                name="email" 
                type="email"
                placeholder="correo@empresa.com" 
                value={nuevoProveedor.email} 
                onChange={handleProveedorChange}
                style={{ borderColor: validationErrors.email ? '#ef4444' : undefined, width: '100%' }}
              />
              {validationErrors.email && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 4 }}>{validationErrors.email}</div>}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Teléfono (opcional)</label>
              <input 
                name="telefono" 
                placeholder="+56 9 1234 5678" 
                value={nuevoProveedor.telefono} 
                onChange={handleProveedorChange}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Dirección (opcional)</label>
              <input 
                name="direccion" 
                placeholder="Calle, número, ciudad" 
                value={nuevoProveedor.direccion} 
                onChange={handleProveedorChange}
                style={{ width: '100%' }}
              />
            </div>
            {error && <div className="error-message" style={{ marginBottom: 16 }}>{error}</div>}
            <button type="submit" style={{ width: '100%' }}>➕ Agregar Proveedor</button>
          </form>
        </div>
      )}

      {/* Modal Terminar Convenio */}
      {showTerminarModal && proveedorATerminar && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ marginTop: 0, color: '#ef4444' }}>⚠️ Terminar Convenio</h3>
            
            <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
              <p style={{ margin: 0, fontWeight: '500', color: '#92400e' }}>
                ¿Estás seguro de que deseas terminar el convenio con <strong>{proveedorATerminar.nombre}</strong>?
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#92400e' }}>
                RUT: {proveedorATerminar.rut} | Email: {proveedorATerminar.email}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
                Motivo de Terminación *
              </label>
              <select 
                value={motivoTerminacion}
                onChange={(e) => setMotivoTerminacion(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.95rem'
                }}
              >
                <option value="cambio_proveedor">Cambio de Proveedor</option>
                <option value="calidad_baja">Problemas de Calidad</option>
                <option value="precio_alto">Precio No Competitivo</option>
                <option value="incumplimiento">Incumplimiento de Acuerdos</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
                Comentario / Observaciones *
              </label>
              <textarea 
                value={comentarioTerminacion}
                onChange={(e) => setComentarioTerminacion(e.target.value)}
                placeholder="Explica el motivo de la terminación (este mensaje se considerará como comunicación formal de cierre del acuerdo)"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
              />
            </div>

            {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowTerminarModal(false);
                  setProveedorATerminar(null);
                  setComentarioTerminacion('');
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#d1d5db'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              >
                Cancelar
              </button>
              <button
                onClick={handleTerminarConvenio}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                Terminar Convenio
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProveedoresPage;
