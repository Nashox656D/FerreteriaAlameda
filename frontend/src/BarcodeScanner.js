import React, { useState, useRef, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';

function BarcodeScanner() {
  const [isActive, setIsActive] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [producto, setProducto] = useState(null);
  const [stock, setStock] = useState(null);
  const [operation, setOperation] = useState(null); // 'agregar', 'consultar', 'restar'
  const [cantidad, setCantidad] = useState('1');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', marca: '', categoria: '', precio: '' });
  const inputRef = useRef(null);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const handleBarcodeInput = async (e) => {
    if (e.key === 'Enter' && scannedCode.trim()) {
      setError('');
      setSuccess('');
      setProducto(null);
      setStock(null);
      setOperation(null);

      try {
        const token = localStorage.getItem('ticashop_token') || localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Token ${token}` } : {};

        // Buscar producto por SKU
        const resProductos = await fetch(API_URL + 'productos/', { headers });
        const productos = await resProductos.json();
        const productoEncontrado = productos.find(p => p.sku === scannedCode.trim());

        if (!productoEncontrado) {
          setError(`Producto con SKU "${scannedCode}" no encontrado. ¿Deseas crearlo?`);
          setShowCreateProduct(true);
          setNuevoProducto({ nombre: '', marca: '', categoria: '', precio: '' });
          return;
        }

        // Buscar stock del producto
        const resStock = await fetch(API_URL + 'stock/', { headers });
        const stockData = await resStock.json();
        const stockEncontrado = stockData.find(s => s.producto === productoEncontrado.id);

        setProducto(productoEncontrado);
        setStock(stockEncontrado || { producto: productoEncontrado.id, cantidad: 0, ubicacion: '' });
        setScannedCode('');
        setCantidad('1');
      } catch (err) {
        setError('Error al buscar el producto.');
        setScannedCode('');
      }
    }
  };

  const handleOperation = async (op) => {
    setOperation(op);
    if (op !== 'consultar') {
      // 'agregar' y 'restar' requieren cantidad
      return;
    }
    // 'consultar' no requiere más acciones
  };

  const handleConfirmOperation = async () => {
    if (!producto || !operation) return;

    if (operation !== 'consultar' && (!cantidad || parseInt(cantidad) <= 0)) {
      setError('Ingresa una cantidad válida.');
      return;
    }

    try {
      const token = localStorage.getItem('ticashop_token') || localStorage.getItem('token');
      const headers = token
        ? { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' };

      if (operation === 'consultar') {
        setSuccess(
          `Stock actual de "${producto.nombre}": ${stock ? stock.cantidad : 0} unidades. ` +
          (stock && stock.ubicacion ? `Ubicación: ${stock.ubicacion}` : '')
        );
      } else if (operation === 'agregar') {
        const cantidadNum = parseInt(cantidad);
        const nuevoStock = (stock ? stock.cantidad : 0) + cantidadNum;

        if (stock && stock.id) {
          // Actualizar stock existente (tiene ID en BD)
          const res = await fetch(API_URL + `stock/${stock.id}/`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ cantidad: nuevoStock }),
          });
          if (!res.ok) throw new Error();
        } else {
          // Crear nuevo stock (no existe en BD)
          const res = await fetch(API_URL + 'stock/', {
            method: 'POST',
            headers,
            body: JSON.stringify({ producto: producto.id, cantidad: cantidadNum, ubicacion: '' }),
          });
          if (!res.ok) throw new Error();
        }

        setSuccess(`✓ Se agregaron ${cantidadNum} unidades de "${producto.nombre}". Stock actual: ${nuevoStock}`);
        setProducto(null);
        setStock(null);
        setOperation(null);
      } else if (operation === 'restar') {
        const cantidadNum = parseInt(cantidad);
        const cantidadActual = stock && stock.id ? stock.cantidad : 0;

        if (cantidadNum > cantidadActual) {
          setError(`No hay suficiente stock. Disponible: ${cantidadActual} unidades.`);
          return;
        }

        const nuevoStock = cantidadActual - cantidadNum;

        if (stock && stock.id) {
          const res = await fetch(API_URL + `stock/${stock.id}/`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ cantidad: nuevoStock }),
          });
          if (!res.ok) throw new Error();
        } else {
          setError('No existe stock registrado para este producto.');
          return;
        }

        setSuccess(`✓ Se restaron ${cantidadNum} unidades de "${producto.nombre}". Stock actual: ${nuevoStock}`);
        setProducto(null);
        setStock(null);
        setOperation(null);
      }

      setCantidad('1');
    } catch (err) {
      setError('Error al procesar la operación.');
    }
  };

  const handleCancel = () => {
    setProducto(null);
    setStock(null);
    setOperation(null);
    setScannedCode('');
    setCantidad('1');
    setError('');
    setShowCreateProduct(false);
    setNuevoProducto({ nombre: '', marca: '', categoria: '', precio: '' });
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>📱 Escáner de Código de Barras</h2>

      {!isActive ? (
        <button
          onClick={() => setIsActive(true)}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          ▶ Activar Escáner
        </button>
      ) : (
        <div>
          <div
            style={{
              backgroundColor: '#dbeafe',
              border: '2px solid #3b82f6',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, color: '#1e40af', fontWeight: 'bold' }}>
              🔴 Escáner Activo - Escanea un código de barras
            </p>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={scannedCode}
            onChange={(e) => setScannedCode(e.target.value)}
            onKeyPress={handleBarcodeInput}
            placeholder="Escanea aquí..."
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              border: '2px solid #3b82f6',
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box',
            }}
            autoFocus
          />

          <button
            onClick={() => setIsActive(false)}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%',
              marginBottom: '12px',
            }}
          >
            ⏹ Desactivar Escáner
          </button>
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '12px',
            borderRadius: '6px',
            marginTop: '12px',
            border: '1px solid #fca5a5',
          }}
        >
          ⚠ {error}
        </div>
      )}

      {success && (
        <div
          style={{
            backgroundColor: '#dcfce7',
            color: '#166534',
            padding: '12px',
            borderRadius: '6px',
            marginTop: '12px',
            border: '1px solid #86efac',
          }}
        >
          {success}
        </div>
      )}

      {producto && !operation && (
        <div
          style={{
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '16px',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Producto Encontrado</h3>
          <p>
            <strong>SKU:</strong> {producto.sku}
          </p>
          <p>
            <strong>Nombre:</strong> {producto.nombre}
          </p>
          <p>
            <strong>Categoría:</strong> {producto.categoria}
          </p>
          <p>
            <strong>Precio:</strong> ${producto.precio}
          </p>
          <p>
            <strong>Stock Actual:</strong> {stock ? stock.cantidad : 0} unidades
          </p>

          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleOperation('consultar')}
              style={{
                backgroundColor: '#06b6d4',
                color: 'white',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1,
                minWidth: '120px',
              }}
            >
              🔍 Consultar
            </button>
            <button
              onClick={() => handleOperation('agregar')}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1,
                minWidth: '120px',
              }}
            >
              ➕ Agregar
            </button>
            <button
              onClick={() => handleOperation('restar')}
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1,
                minWidth: '120px',
              }}
            >
              ➖ Restar (Venta)
            </button>
          </div>

          <button
            onClick={handleCancel}
            style={{
              backgroundColor: '#9ca3af',
              color: 'white',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%',
              marginTop: '8px',
            }}
          >
            Cancelar
          </button>
        </div>
      )}

      {producto && operation && operation !== 'consultar' && (
        <div
          style={{
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '16px',
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            {operation === 'agregar' ? '➕ Agregar Stock' : '➖ Restar Stock (Venta)'}
          </h3>
          <p>
            <strong>Producto:</strong> {producto.nombre}
          </p>

          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Cantidad:
          </label>
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              boxSizing: 'border-box',
              fontSize: '16px',
            }}
          />

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleConfirmOperation}
              style={{
                backgroundColor: '#059669',
                color: 'white',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              ✓ Confirmar
            </button>
            <button
              onClick={() => setOperation(null)}
              style={{
                backgroundColor: '#9ca3af',
                color: 'white',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              Atrás
            </button>
          </div>
        </div>
      )}

      {producto && operation === 'consultar' && (
        <div
          style={{
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '16px',
          }}
        >
          <button
            onClick={handleCancel}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Escanear Otro
          </button>
        </div>
      )}

      {showCreateProduct && (
        <div
          style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '16px',
          }}
        >
          <h3 style={{ marginTop: 0 }}>➕ Crear Nuevo Producto</h3>
          <p style={{ color: '#92400e', marginBottom: '12px' }}>
            SKU: <strong>{scannedCode}</strong>
          </p>

          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Nombre:
          </label>
          <input
            type="text"
            value={nuevoProducto.nombre}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
            placeholder="Nombre del producto"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              boxSizing: 'border-box',
              fontSize: '14px',
            }}
          />

          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Categoría:
          </label>
          <input
            type="text"
            value={nuevoProducto.categoria}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
            placeholder="Ej: Herramientas, Pintura, Etc."
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              boxSizing: 'border-box',
              fontSize: '14px',
            }}
          />

          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Marca (opcional):
          </label>
          <input
            type="text"
            value={nuevoProducto.marca}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, marca: e.target.value })}
            placeholder="Ej: Bosch, DeWalt, etc."
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              boxSizing: 'border-box',
              fontSize: '14px',
            }}
          />

          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Precio:
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={nuevoProducto.precio}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
            placeholder="0.00"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              boxSizing: 'border-box',
              fontSize: '14px',
            }}
          />

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={async () => {
                if (!nuevoProducto.nombre.trim() || !nuevoProducto.categoria.trim() || !nuevoProducto.precio) {
                  setError('Completa todos los campos requeridos.');
                  return;
                }

                try {
                  const token = localStorage.getItem('ticashop_token') || localStorage.getItem('token');
                  const headers = token
                    ? { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' }
                    : { 'Content-Type': 'application/json' };

                  const res = await fetch(API_URL + 'productos/', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                      sku: scannedCode,
                      nombre: nuevoProducto.nombre,
                      marca: nuevoProducto.marca,
                      categoria: nuevoProducto.categoria,
                      precio: parseFloat(nuevoProducto.precio),
                      descripcion: '',
                      activo: true,
                    }),
                  });

                  if (!res.ok) throw new Error();
                  const productoCreado = await res.json();

                  setProducto(productoCreado);
                  setStock({ producto: productoCreado.id, cantidad: 0, ubicacion: '' });
                  setShowCreateProduct(false);
                  setSuccess(`✓ Producto "${productoCreado.nombre}" creado exitosamente.`);
                  setCantidad('1');
                } catch (err) {
                  setError('Error al crear el producto.');
                }
              }}
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1,
                fontWeight: 'bold',
              }}
            >
              ✓ Crear Producto
            </button>
            <button
              onClick={() => {
                setShowCreateProduct(false);
                setError('');
                setScannedCode('');
                setNuevoProducto({ nombre: '', categoria: '', precio: '' });
                if (inputRef.current) inputRef.current.focus();
              }}
              style={{
                backgroundColor: '#9ca3af',
                color: 'white',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BarcodeScanner;
