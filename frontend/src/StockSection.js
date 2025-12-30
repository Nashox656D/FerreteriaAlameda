import React from 'react';

function StockSection({ stock, handleStockSubmit, nuevoStock, handleStockChange, productosDisponibles, buscaStock, setBuscaStock, usuario, descargarExcel }) {
  // Función helper para determinar nivel de stock y color
  const getNivelStock = (cantidad) => {
    if (cantidad < 2) {
      return { nivel: 'Rojo', color: '#ef4444', bgColor: '#fee2e2', text: '🔴 Crítico' };
    } else if (cantidad <= 5) {
      return { nivel: 'Amarillo', color: '#f59e0b', bgColor: '#fef3c7', text: '🟡 Moderado' };
    } else {
      return { nivel: 'Verde', color: '#10b981', bgColor: '#d1fae5', text: '🟢 Bueno' };
    }
  };

  // Agrupar stock por producto
  const stockAgrupado = stock.reduce((acc, s) => {
    const productoInfo = s.productoInfo || {};
    const sku = productoInfo.sku;
    if (!sku) return acc;
    
    if (!acc[sku]) {
      acc[sku] = {
        sku: sku,
        nombre: productoInfo.nombre,
        marca: productoInfo.marca || '',
        cantidad: 0
      };
    }
    acc[sku].cantidad += s.cantidad;
    return acc;
  }, {});

  // Convertir a array y filtrar
  const stockFiltrado = Object.values(stockAgrupado)
    .filter(item => 
      !buscaStock || 
      item.nombre.toLowerCase().includes(buscaStock.toLowerCase()) ||
      item.sku.toLowerCase().includes(buscaStock.toLowerCase()) ||
      item.marca.toLowerCase().includes(buscaStock.toLowerCase())
    );

  // Detectar productos en rojo (cantidad < 2)
  const productosEnRojo = Object.values(stockAgrupado).filter(item => item.cantidad < 2);

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Stock</h2>
        <button 
          onClick={descargarExcel}
          style={{ 
            background: '#00bfa5', 
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          📥 Descargar Excel
        </button>
      </div>

      {/* Alerta de productos en rojo */}
      {productosEnRojo.length > 0 && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '2px solid #ef4444',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px',
          color: '#7f1d1d'
        }}>
          <strong>⚠️ Alerta de Stock Crítico:</strong>
          <div style={{ marginTop: '8px' }}>
            {productosEnRojo.map(item => (
              <div key={item.sku}>
                • <strong>{item.sku}</strong> - {item.nombre} (Stock: {item.cantidad})
              </div>
            ))}
          </div>
        </div>
      )}

      {usuario?.cargo !== 'Empleado' && (
        <form onSubmit={handleStockSubmit} style={{ marginBottom: 16 }}>
          <select 
            name="producto" 
            value={nuevoStock.producto} 
            onChange={handleStockChange}
            required
            style={{ padding: '4px', marginRight: '8px' }}
          >
            <option value="">Seleccione un producto</option>
            {productosDisponibles.map(p => (
              <option key={p.id} value={p.sku}>
                {p.sku} - {p.nombre}
              </option>
            ))}
          </select>
          <input 
            name="cantidad" 
            type="number" 
            placeholder="Cantidad" 
            value={nuevoStock.cantidad} 
            onChange={handleStockChange}
            required
            min="1"
          />{' '}
          <button type="submit">Agregar</button>
        </form>
      )}
      
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Buscar por nombre, SKU o marca"
          value={buscaStock}
          onChange={e => setBuscaStock(e.target.value)}
          style={{ width: 280, padding: '4px' }}
        />
      </div>

      <table border="1" cellPadding="6" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Cantidad Total</th>
            <th>Nivel de Stock</th>
          </tr>
        </thead>
        <tbody>
          {stockFiltrado.map(item => {
            const nivelInfo = getNivelStock(item.cantidad);
            return (
              <tr key={item.sku}>
                <td>{item.sku}</td>
                <td>{item.nombre}</td>
                <td>{item.marca || '-'}</td>
                <td>{item.cantidad}</td>
                <td style={{
                  backgroundColor: nivelInfo.bgColor,
                  color: nivelInfo.color,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  borderRadius: '4px'
                }}>
                  {nivelInfo.text}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export default StockSection;