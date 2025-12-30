import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';

function ReportesPage({ usuario }) {
  const [sku, setSku] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const descargarMovimientos = async () => {
    setError('');
    setDownloading(true);
    try {
      const params = new URLSearchParams();
      if (sku) params.append('producto', sku);
      if (desde) params.append('desde', desde);
      if (hasta) params.append('hasta', hasta);

      const token = usuario && usuario.token ? usuario.token : null;
      const headers = token ? { Authorization: `Token ${token}` } : {};

      const url = API_URL + 'stock/descargar_movimientos/';
      const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;

      const res = await fetch(finalUrl, { method: 'GET', headers });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get('Content-Disposition') || '';
      let filename = 'Movimientos.xlsx';
      // Try RFC5987 filename* first, then filename
      const filenameStarMatch = contentDisposition.match(/filename\*=[^']*'[^']*'([^;\s]+)/i);
      const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
      if (filenameStarMatch && filenameStarMatch[1]) {
        try {
          filename = decodeURIComponent(filenameStarMatch[1]);
        } catch (e) {
          filename = filenameStarMatch[1];
        }
      } else if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
      // Ensure .xlsx extension
      if (!filename.toLowerCase().endsWith('.xlsx')) filename += '.xlsx';

      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlBlob;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error desconocido');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <h2>Reportes</h2>
      <p>Descargar reportes de movimientos de stock.</p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <div>
          <label>SKU (opcional)</label><br />
          <input value={sku} onChange={e => setSku(e.target.value)} placeholder="Ej: SKU123" />
        </div>
        <div>
          <label>Desde (ISO)</label><br />
          <input value={desde} onChange={e => setDesde(e.target.value)} placeholder="2025-01-01T00:00:00" />
        </div>
        <div>
          <label>Hasta (ISO)</label><br />
          <input value={hasta} onChange={e => setHasta(e.target.value)} placeholder="2025-12-31T23:59:59" />
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <button onClick={descargarMovimientos} disabled={downloading}>
          {downloading ? 'Descargando...' : 'Descargar Movimientos (XLSX)'}
        </button>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default ReportesPage;
