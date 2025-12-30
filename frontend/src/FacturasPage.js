import React, { useEffect, useState } from 'react';
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';

function FacturasPage() {
  const [facturas, setFacturas] = useState([]);
  const [nuevaFactura, setNuevaFactura] = useState({ numero: '', cliente: '', fecha: '', fecha_vencimiento: '', monto: '', pagada: false });
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(API_URL + 'facturas/')
      .then(r => r.json()).then(setFacturas)
      .catch(() => setError('No se pudieron cargar las facturas.'));
  }, []);

  const handleFacturaChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setNuevaFactura({ ...nuevaFactura, [e.target.name]: value });
  };
  
  const handleFacturaSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...nuevaFactura,
        monto: parseFloat(nuevaFactura.monto) || 0,
        fecha_vencimiento: nuevaFactura.fecha_vencimiento || null
      };
      
      const res = await fetch(API_URL + 'facturas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      const fac = await res.json();
      setFacturas([...facturas, fac]);
      setNuevaFactura({ numero: '', cliente: '', fecha: '', fecha_vencimiento: '', monto: '', pagada: false });
    } catch {
      setError('Error al crear factura');
    }
  };

  const descargarExcel = async () => {
    try {
      const token = localStorage.getItem('ticashop_token') || localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Token ${token}` } : {};
      const res = await fetch(API_URL + 'facturas/descargar_excel/', { headers });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Facturas_${new Date().toISOString().slice(0,10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      setError('Error al descargar Excel');
    }
  };

  const descargarExcelDetalle = async () => {
    try {
      const token = localStorage.getItem('ticashop_token') || localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Token ${token}` } : {};
      const res = await fetch(API_URL + 'facturas/descargar_excel_detalle/', { headers });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Facturas_Detalle_${new Date().toISOString().slice(0,10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      setError('Error al descargar Excel detallado');
    }
  };

  return (
    <section>
      <h2>Facturas</h2>
      <div style={{ marginBottom: 16 }}>
        <button onClick={descargarExcel} style={{ marginRight: 8, backgroundColor: '#28a745', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          📥 Descargar Excel
        </button>
        <button onClick={descargarExcelDetalle} style={{ backgroundColor: '#2563EB', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          📂 Descargar Excel (Detalle)
        </button>
      </div>
      <form onSubmit={handleFacturaSubmit} style={{ marginBottom: 16 }}>
        <input name="numero" placeholder="Número" value={nuevaFactura.numero} onChange={handleFacturaChange} />{' '}
        <input name="cliente" placeholder="Cliente" value={nuevaFactura.cliente} onChange={handleFacturaChange} />{' '}
        <input name="fecha" type="date" placeholder="Fecha" value={nuevaFactura.fecha} onChange={handleFacturaChange} />{' '}
        <input name="fecha_vencimiento" type="date" placeholder="Fecha Vencimiento" value={nuevaFactura.fecha_vencimiento} onChange={handleFacturaChange} />{' '}
        <input name="monto" placeholder="Monto" value={nuevaFactura.monto} onChange={handleFacturaChange} />{' '}
        <label style={{ marginLeft: '10px' }}>
          <input name="pagada" type="checkbox" checked={nuevaFactura.pagada} onChange={handleFacturaChange} /> Pagada
        </label>{' '}
        <button type="submit">Agregar</button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <table border="1" cellPadding="6" style={{ width: '100%' }}>
        <thead><tr><th>ID</th><th>Número</th><th>Cliente</th><th>Fecha</th><th>Fecha Vencimiento</th><th>Monto</th><th>Pagada</th></tr></thead>
        <tbody>
          {facturas.map(f => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.numero}</td>
              <td>{(f.cliente_detalle && f.cliente_detalle.nombre) || f.cliente || 'Consumidor'}</td>
              <td>{f.fecha}</td>
              <td>{f.fecha_vencimiento || 'N/A'}</td>
              <td>${f.monto}</td>
              <td style={{ color: f.pagada ? 'green' : 'red', fontWeight: 'bold' }}>
                {f.pagada ? 'Sí' : 'No'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default FacturasPage;