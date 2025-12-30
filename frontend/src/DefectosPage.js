import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';

function DefectosPage({ usuario }) {
  const [stock, setStock] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [cantidadCambio, setCantidadCambio] = useState(0);
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [vista, setVista] = useState('defectos'); // 'defectos' o 'devoluciones'
  
  // Devoluciones
  const [productoDevolucion, setProductoDevolucion] = useState('');
  const [cantidadDevolucion, setCantidadDevolucion] = useState(0);
  const [estadoDevolucion, setEstadoDevolucion] = useState('apto');
  const [motivoDevolucion, setMotivoDevolucion] = useState('');
  const [loadingDevolucion, setLoadingDevolucion] = useState(false);

  const ESTADO_COLORS = {
    apto: '#10b981',
    defectuoso: '#ef4444',
    cuarentena: '#f59e0b',
    reclamo: '#8b5cf6',
    dado_baja: '#6b7280',
  };

  const ESTADO_LABELS = {
    apto: 'Apto para venta',
    defectuoso: 'Defectuoso',
    cuarentena: 'En cuarentena',
    reclamo: 'En reclamo a proveedor',
    dado_baja: 'Dado de baja',
  };

  useEffect(() => {
    cargarStock();
    cargarProductos();
  }, []);

  const cargarStock = async () => {
    try {
      const token = localStorage.getItem('ticashop_token');
      const res = await fetch(API_URL + 'stock/', {
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) throw new Error('Error al cargar stock');
      const data = await res.json();
      setStock(data);
    } catch (err) {
      setError('No se pudo cargar el stock');
    }
  };

  const cargarProductos = async () => {
    try {
      const token = localStorage.getItem('ticashop_token');
      const res = await fetch(API_URL + 'productos/', {
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      // No es crítico si falla
    }
  };

  const stockFiltrado = filtroEstado
    ? stock.filter(s => s.estado === filtroEstado)
    : stock;

  const handleCambiarEstado = async () => {
    if (!selectedStock || !nuevoEstado) {
      setError('Selecciona un estado');
      return;
    }

    if (cantidadCambio <= 0 || cantidadCambio > selectedStock.cantidad) {
      setError(`Ingresa una cantidad válida (1 a ${selectedStock.cantidad})`);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('ticashop_token');
      const res = await fetch(API_URL + `stock/${selectedStock.id}/cambiar_estado/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          estado: nuevoEstado,
          cantidad: cantidadCambio,
          motivo: motivo,
        }),
      });

      if (!res.ok) throw new Error('Error al cambiar estado');
      
      setError('');
      setSuccess('Estado actualizado exitosamente');
      setSelectedStock(null);
      setNuevoEstado('');
      setCantidadCambio(0);
      setMotivo('');
      await cargarStock();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al cambiar estado: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecuperarProducto = async () => {
    if (!productoDevolucion || cantidadDevolucion <= 0) {
      setError('Selecciona un producto y cantidad válida');
      return;
    }

    setLoadingDevolucion(true);
    try {
      const token = localStorage.getItem('ticashop_token');
      const res = await fetch(API_URL + 'stock/recibir_devolucion/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          producto: productoDevolucion,
          cantidad: cantidadDevolucion,
          estado: estadoDevolucion,
          motivo: motivoDevolucion,
        }),
      });

      if (!res.ok) throw new Error('Error al registrar devolución');
      
      setError('');
      setSuccess('¡Devolución registrada exitosamente!');
      setProductoDevolucion('');
      setCantidadDevolucion(0);
      setEstadoDevolucion('apto');
      setMotivoDevolucion('');
      await cargarStock();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al registrar devolución: ' + err.message);
    } finally {
      setLoadingDevolucion(false);
    }
  };

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Gestión de Defectos y Devoluciones</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setVista('defectos')}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: 'none',
              background: vista === 'defectos' ? '#3b82f6' : '#e5e7eb',
              color: vista === 'defectos' ? 'white' : '#374151',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ⚠️ Defectos
          </button>
          <button
            onClick={() => setVista('devoluciones')}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: 'none',
              background: vista === 'devoluciones' ? '#3b82f6' : '#e5e7eb',
              color: vista === 'devoluciones' ? 'white' : '#374151',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ↩️ Devoluciones
          </button>
        </div>
      </div>

      {error && (
        <div style={{ color: '#c62828', marginBottom: 16, padding: 12, backgroundColor: '#ffe6e6', borderRadius: 4 }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ color: '#10b981', marginBottom: 16, padding: 12, backgroundColor: '#e8f5e9', borderRadius: 4 }}>
          {success}
        </div>
      )}

      {/* VISTA DE DEFECTOS */}
      {vista === 'defectos' && (
        <div>

      {/* Panel de filtros */}
      <div style={{ marginBottom: 20, padding: 12, backgroundColor: '#f3f4f6', borderRadius: 6 }}>
        <label style={{ marginRight: 8 }}>Filtrar por estado: </label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          style={{ padding: 6, borderRadius: 4 }}
        >
          <option value="">Todos los estados</option>
          {Object.entries(ESTADO_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de stock */}
      <div style={{ overflowX: 'auto', marginBottom: 20 }}>
        <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: 20 }}>
          <thead>
            <tr style={{ backgroundColor: '#4A90E2', color: 'white', fontWeight: 'bold' }}>
              <th>SKU</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Estado Actual</th>
              <th>Ubicación</th>
              <th>Motivo Defecto</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {stockFiltrado.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: 20 }}>
                  No hay registros de stock
                </td>
              </tr>
            ) : (
              stockFiltrado.map((s) => (
                <tr key={s.id}>
                  <td>{s.producto_sku}</td>
                  <td>{s.producto_nombre}</td>
                  <td style={{ textAlign: 'center' }}>{s.cantidad}</td>
                  <td>
                    <span
                      style={{
                        backgroundColor: ESTADO_COLORS[s.estado],
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      {ESTADO_LABELS[s.estado]}
                    </span>
                  </td>
                  <td>{s.ubicacion || '-'}</td>
                  <td>{s.motivo_defecto || '-'}</td>
                  <td>
                    <button
                      onClick={() => setSelectedStock(s)}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 12,
                      }}
                    >
                      ✏️ Cambiar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Panel de cambio de estado */}
      {selectedStock && (
        <div
          style={{
            border: '2px solid #3b82f6',
            padding: 20,
            borderRadius: 8,
            backgroundColor: '#f0f9ff',
            marginBottom: 20,
          }}
        >
          <h3>🔄 Cambiar Estado del Stock</h3>
          <div style={{ marginBottom: 12 }}>
            <strong>Producto:</strong> {selectedStock.producto_sku} - {selectedStock.producto_nombre}
          </div>
          <div style={{ marginBottom: 12 }}>
            <strong>Cantidad:</strong> {selectedStock.cantidad} unidades
          </div>
          <div style={{ marginBottom: 12 }}>
            <strong>Estado actual:</strong>{' '}
            <span
              style={{
                backgroundColor: ESTADO_COLORS[selectedStock.estado],
                color: 'white',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              {ESTADO_LABELS[selectedStock.estado]}
            </span>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Cantidad a cambiar de estado:</strong>
            <input
              type="number"
              min="1"
              max={selectedStock.cantidad}
              value={cantidadCambio}
              onChange={(e) => setCantidadCambio(parseInt(e.target.value) || 0)}
              placeholder={`Máximo: ${selectedStock.cantidad}`}
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 4,
                marginTop: 4,
                border: '1px solid #ccc',
              }}
            />
            <small style={{ color: '#666' }}>
              Vas a cambiar {cantidadCambio} de {selectedStock.cantidad} unidades
            </small>
          </div>

          <div style={{ marginBottom: 12 }}>
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              style={{
                padding: 8,
                borderRadius: 4,
                width: '100%',
                marginTop: 4,
              }}
            >
              <option value="">Selecciona nuevo estado</option>
              {Object.entries(ESTADO_LABELS)
                .filter(([key]) => key !== selectedStock.estado)
                .map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Motivo o Observación: </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej: Mango astillado, Falla de motor, etc."
              style={{
                width: '100%',
                minHeight: 80,
                padding: 8,
                borderRadius: 4,
                marginTop: 4,
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleCambiarEstado}
              disabled={loading}
              style={{
                background: '#10b981',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: 4,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? '⏳ Procesando...' : '✓ Confirmar'}
            </button>
            <button
              onClick={() => {
                setSelectedStock(null);
                setNuevoEstado('');
                setCantidadCambio(0);
                setMotivo('');
              }}
              style={{
                background: '#ef4444',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              ✕ Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Resumen por estado */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {Object.entries(ESTADO_LABELS).map(([key, label]) => {
          const cantidad = stock.filter(s => s.estado === key).length;
          return (
            <div
              key={key}
              style={{
                padding: 12,
                borderRadius: 6,
                backgroundColor: ESTADO_COLORS[key],
                color: 'white',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.9 }}>{label}</div>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>{cantidad}</div>
            </div>
          );
        })}
      </div>
        </div>
      )}

      {/* VISTA DE DEVOLUCIONES */}
      {vista === 'devoluciones' && (
        <div>
          <div
            style={{
              border: '2px solid #10b981',
              padding: 20,
              borderRadius: 8,
              backgroundColor: '#f0fdf4',
            }}
          >
            <h3>↩️ Registrar Devolución de Producto</h3>
            <p style={{ color: '#666', marginBottom: 16 }}>
              Usa este formulario cuando un cliente devuelve un producto que había sido restado del stock.
            </p>

            <div style={{ marginBottom: 12 }}>
              <label>Selecciona el producto: </label>
              <select
                value={productoDevolucion}
                onChange={(e) => setProductoDevolucion(e.target.value)}
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 4,
                  marginTop: 4,
                }}
              >
                <option value="">-- Elige un producto --</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.sku} - {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label>Cantidad devuelta: </label>
              <input
                type="number"
                min="1"
                value={cantidadDevolucion}
                onChange={(e) => setCantidadDevolucion(parseInt(e.target.value) || 0)}
                placeholder="Cantidad"
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 4,
                  marginTop: 4,
                }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label>Estado en que llega: </label>
              <select
                value={estadoDevolucion}
                onChange={(e) => setEstadoDevolucion(e.target.value)}
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 4,
                  marginTop: 4,
                }}
              >
                {Object.entries(ESTADO_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label>Motivo de la devolución: </label>
              <textarea
                value={motivoDevolucion}
                onChange={(e) => setMotivoDevolucion(e.target.value)}
                placeholder="Ej: Cliente cambió de idea, defecto encontrado, empaque dañado, etc."
                style={{
                  width: '100%',
                  minHeight: 80,
                  padding: 8,
                  borderRadius: 4,
                  marginTop: 4,
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleRecuperarProducto}
                disabled={loadingDevolucion}
                style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: 4,
                  cursor: loadingDevolucion ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  opacity: loadingDevolucion ? 0.6 : 1,
                }}
              >
                {loadingDevolucion ? '⏳ Registrando...' : '✓ Registrar Devolución'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default DefectosPage;
