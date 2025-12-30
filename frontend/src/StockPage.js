import React, { useEffect, useState } from 'react';
import StockSection from './StockSection';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';


function StockPage(props) {
  const { usuario } = props;
  // Preferir estados pasados por props (desde App.js) para mantener sincronía.
  const externalStock = props.stock;
  const externalSetStock = props.setStock;
  const externalProductos = props.productosDisponibles;

  const [stock, setStock] = useState(externalStock || []);
  const [productosDisponibles, setProductosDisponibles] = useState(externalProductos || []);
  const [nuevoStock, setNuevoStock] = useState(props.nuevoStock || { producto: '', cantidad: '' });
  const [buscaStock, setBuscaStock] = useState(props.buscaStock || '');

  useEffect(() => {
    // Si App.js ya pasa datos, mantenerlos; si no, obtenerlos del backend.
    if (externalProductos && externalProductos.length > 0) {
      setProductosDisponibles(externalProductos);
    }
    if (externalStock && externalStock.length > 0) {
      // If both external stock and products are provided, merge so products without stock show as 0
      if (externalProductos && externalProductos.length > 0) {
        const stockMap = new Map(externalStock.map(s => [s.producto, s]));
        const merged = externalProductos.map(p => {
          const s = stockMap.get(p.id);
          if (s) return { ...s, productoInfo: p };
          return { id: null, producto: p.id, cantidad: 0, ubicacion: '', productoInfo: p };
        });
        setStock(merged);
      } else {
        setStock(externalStock);
      }
    }

    if ((!externalStock || externalStock.length === 0) || (!externalProductos || externalProductos.length === 0)) {
      const token = localStorage.getItem('ticashop_token');
      const headers = token ? { 'Authorization': `Token ${token}` } : {};

      Promise.all([
        fetch(API_URL + 'stock/', { headers }).then(r => r.json()),
        fetch(API_URL + 'productos/', { headers }).then(r => r.json())
      ]).then(([stockData, productosData]) => {
        // Build a merged list including products with zero stock
        const stockMap = new Map(stockData.map(s => [s.producto, s]));
        const stockConProducto = productosData.map(p => {
          const s = stockMap.get(p.id);
          if (s) return { ...s, productoInfo: p };
          return { id: null, producto: p.id, cantidad: 0, ubicacion: '', productoInfo: p };
        });
        setStock(stockConProducto);
        setProductosDisponibles(productosData);
        // Propagar a App si proporciona setter
        if (externalSetStock) externalSetStock(stockConProducto);
      }).catch(() => {});
    }
  }, []);

  const handleStockChange = e => setNuevoStock({ ...nuevoStock, [e.target.name]: e.target.value });
  const handleStockSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('ticashop_token');
      const headers = Object.assign({ 'Content-Type': 'application/json' }, token ? { 'Authorization': `Token ${token}` } : {});
      const res = await fetch(API_URL + 'stock/', {
        method: 'POST',
        headers,
        body: JSON.stringify(nuevoStock)
      });
      if (!res.ok) throw new Error();
      const st = await res.json();
      const producto = productosDisponibles.find(p => p.id === st.producto);
      const nuevoRegistro = { ...st, productoInfo: producto };
      if (externalSetStock) {
        externalSetStock(prev => [...prev, nuevoRegistro]);
      }
      setStock(prev => [...prev, nuevoRegistro]);
      setNuevoStock({ producto: '', cantidad: '' });
    } catch {}
  };

  const descargarExcel = () => {
    const headers = {};
    if (usuario && usuario.token) headers['Authorization'] = `Token ${usuario.token}`;
    
    fetch(API_URL + 'stock/descargar_excel/', { headers })
      .then(response => {
        if (!response.ok) throw new Error('Error al descargar');
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Stock_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(() => {});
  };

  return (
    <StockSection
      stock={stock}
      handleStockSubmit={handleStockSubmit}
      nuevoStock={nuevoStock}
      handleStockChange={handleStockChange}
      productosDisponibles={productosDisponibles}
      buscaStock={buscaStock}
      setBuscaStock={setBuscaStock}
      usuario={usuario}
      descargarExcel={descargarExcel}
    />
  );
}

export default StockPage;