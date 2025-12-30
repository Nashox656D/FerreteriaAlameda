import React, { useEffect, useState } from 'react';
import { fetchProductos, crearProducto } from './api';
import { validarNombre, validarNumeroPositivo } from './utils/validations';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';

function ProductosPage({ usuario, ...props }) {
  const [productos, setProductos] = useState([]);
  const [nuevo, setNuevo] = useState({ sku: '', nombre: '', marca: '', precio: '', categoria: '' });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [editandoId, setEditandoId] = useState(null);
  const [editando, setEditando] = useState({ sku: '', nombre: '', marca: '', precio: '', categoria: '' });
  const [imagenes, setImagenes] = useState({});
  const [productoSeleccionadoImagen, setProductoSeleccionadoImagen] = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  useEffect(() => {
    fetchProductos()
      .then(setProductos)
      .catch(() => setError('No se pudieron cargar los productos.'));
    cargarTodasLasImagenes();
  }, []);

  const cargarTodasLasImagenes = async () => {
    try {
      const token = localStorage.getItem('ticashop_token');
      const res = await fetch(API_URL + 'imagenes/', {
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const imagenesMap = {};
      data.forEach(img => {
        if (!imagenesMap[img.producto]) imagenesMap[img.producto] = [];
        imagenesMap[img.producto].push(img);
      });
      setImagenes(imagenesMap);
    } catch (err) {
      // No es crítico
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setNuevo({ ...nuevo, [name]: value });
    
    // Limpiar error de validación al escribir
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const handleChangeEditar = e => {
    const { name, value } = e.target;
    setEditando({ ...editando, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    
    // Validar campos
    const nombreValidation = validarNombre(nuevo.nombre);
    const precioValidation = validarNumeroPositivo(nuevo.precio, 'El precio');
    
    const errors = {};
    if (!nuevo.sku) errors.sku = 'El SKU es requerido';
    if (!nombreValidation.valid) errors.nombre = nombreValidation.error;
    if (!precioValidation.valid) errors.precio = precioValidation.error;
    if (!nuevo.categoria) errors.categoria = 'La categoría es requerida';
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {
      const prod = await crearProducto({
        sku: nuevo.sku,
        nombre: nuevo.nombre,
        marca: nuevo.marca,
        precio: nuevo.precio,
        categoria: nuevo.categoria,
        descripcion: '',
        activo: true
      });
      setProductos([...productos, prod]);
      setNuevo({ sku: '', nombre: '', marca: '', precio: '', categoria: '' });
    } catch {
      setError('Error al crear producto');
    }
  };

  const handleEditar = (producto) => {
    setEditandoId(producto.id);
    setEditando({
      sku: producto.sku,
      nombre: producto.nombre,
      marca: producto.marca || '',
      precio: producto.precio,
      categoria: producto.categoria
    });
  };

  const handleCancelarEditar = () => {
    setEditandoId(null);
    setEditando({ sku: '', nombre: '', marca: '', precio: '', categoria: '' });
  };

  const handleGuardarEditar = async (id) => {
    setError('');
    const nombreValidation = validarNombre(editando.nombre);
    const precioValidation = validarNumeroPositivo(editando.precio, 'El precio');
    
    if (!nombreValidation.valid || !precioValidation.valid) {
      setError('Por favor completa todos los campos correctamente');
      return;
    }

    try {
      const token = localStorage.getItem('ticashop_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Token ${token}` })
      };

      const res = await fetch(API_URL + `productos/${id}/`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          sku: editando.sku,
          nombre: editando.nombre,
          marca: editando.marca,
          precio: editando.precio,
          categoria: editando.categoria
        })
      });

      if (!res.ok) throw new Error('Error al actualizar');
      const productoActualizado = await res.json();
      setProductos(productos.map(p => p.id === id ? productoActualizado : p));
      setEditandoId(null);
    } catch (err) {
      setError('Error al actualizar producto');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const token = localStorage.getItem('ticashop_token');
      const headers = token ? { 'Authorization': `Token ${token}` } : {};

      const res = await fetch(API_URL + `productos/${id}/`, {
        method: 'DELETE',
        headers
      });

      if (!res.ok) throw new Error('Error al eliminar');
      setProductos(productos.filter(p => p.id !== id));
    } catch (err) {
      setError('Error al eliminar producto');
    }
  };

  const handleSubirImagen = async (e, productoId) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendoImagen(true);
    try {
      const formData = new FormData();
      formData.append('producto', productoId);
      formData.append('imagen', file);
      formData.append('titulo', file.name);

      const token = localStorage.getItem('ticashop_token');
      const res = await fetch(API_URL + 'imagenes/', {
        method: 'POST',
        headers: { Authorization: `Token ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Error al subir imagen');
      const imagen = await res.json();
      
      // Agregar imagen a la lista
      const nuevasImagenes = { ...imagenes };
      if (!nuevasImagenes[productoId]) nuevasImagenes[productoId] = [];
      nuevasImagenes[productoId].push(imagen);
      setImagenes(nuevasImagenes);
      setProductoSeleccionadoImagen(null);
      setError('');
    } catch (err) {
      setError('Error al subir imagen: ' + err.message);
    } finally {
      setSubiendoImagen(false);
    }
  };

  const descargarExcel = () => {
    const headers = {};
    if (usuario && usuario.token) headers['Authorization'] = `Token ${usuario.token}`;
    
    fetch(API_URL + 'productos/descargar_excel/', { headers })
      .then(response => {
        if (!response.ok) throw new Error('Error al descargar');
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Productos_${new Date().toISOString().slice(0, 10)}.xlsx`;
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
        <h2 style={{ margin: 0 }}>Productos</h2>
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
      {usuario?.cargo !== 'Empleado' && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <input 
              name="sku" 
              placeholder="SKU" 
              value={nuevo.sku} 
              onChange={handleChange}
              style={{ borderColor: validationErrors.sku ? '#c62828' : undefined }}
            />
            {validationErrors.sku && <div style={{ color: '#c62828', fontSize: '0.85rem', marginTop: 4 }}>{validationErrors.sku}</div>}
          </div>
          <div style={{ marginBottom: 8 }}>
            <input 
              name="nombre" 
              placeholder="Nombre (sin números)" 
              value={nuevo.nombre} 
              onChange={handleChange}
              style={{ borderColor: validationErrors.nombre ? '#c62828' : undefined }}
            />
            {validationErrors.nombre && <div style={{ color: '#c62828', fontSize: '0.85rem', marginTop: 4 }}>{validationErrors.nombre}</div>}
          </div>
          <div style={{ marginBottom: 8 }}>
            <input 
              name="marca" 
              placeholder="Marca (opcional)" 
              value={nuevo.marca} 
              onChange={handleChange}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <input 
              name="precio" 
              placeholder="Precio" 
              type="number"
              step="0.01"
              value={nuevo.precio} 
              onChange={handleChange}
              style={{ borderColor: validationErrors.precio ? '#c62828' : undefined }}
            />
            {validationErrors.precio && <div style={{ color: '#c62828', fontSize: '0.85rem', marginTop: 4 }}>{validationErrors.precio}</div>}
          </div>
          <div style={{ marginBottom: 8 }}>
            <input 
              name="categoria" 
              placeholder="Categoría" 
              value={nuevo.categoria} 
              onChange={handleChange}
              style={{ borderColor: validationErrors.categoria ? '#c62828' : undefined }}
            />
            {validationErrors.categoria && <div style={{ color: '#c62828', fontSize: '0.85rem', marginTop: 4 }}>{validationErrors.categoria}</div>}
          </div>
          <button type="submit">Agregar</button>
        </form>
      )}
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <table border="1" cellPadding="6" style={{ width: '100%' }}>
        <thead><tr><th>Imagen</th><th>SKU</th><th>Nombre</th><th>Marca</th><th>Precio</th><th>Categoría</th><th>Acciones</th></tr></thead>
        <tbody>
          {[...productos].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(p => (
            editandoId === p.id ? (
              <tr key={p.id} style={{ backgroundColor: '#fff3cd' }}>
                <td style={{ textAlign: 'center' }}>
                  {imagenes[p.id]?.length > 0 ? (
                    <img src={imagenes[p.id][0].imagen} alt={p.nombre} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                  ) : (
                    <div style={{ width: 50, height: 50, backgroundColor: '#e0e0e0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>Sin foto</div>
                  )}
                </td>
                <td><input name="sku" value={editando.sku} onChange={handleChangeEditar} style={{ width: '100%' }} /></td>
                <td><input name="nombre" value={editando.nombre} onChange={handleChangeEditar} style={{ width: '100%' }} /></td>
                <td><input name="marca" value={editando.marca} onChange={handleChangeEditar} style={{ width: '100%' }} /></td>
                <td><input name="precio" type="number" step="0.01" value={editando.precio} onChange={handleChangeEditar} style={{ width: '100%' }} /></td>
                <td><input name="categoria" value={editando.categoria} onChange={handleChangeEditar} style={{ width: '100%' }} /></td>
                <td>
                  <button onClick={() => handleGuardarEditar(p.id)} style={{ background: '#10b981', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '4px' }}>✓ Guardar</button>
                  <button onClick={handleCancelarEditar} style={{ background: '#ef4444', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✕ Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={p.id}>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    {imagenes[p.id]?.length > 0 ? (
                      <img src={imagenes[p.id][0].imagen} alt={p.nombre} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }} onClick={() => setProductoSeleccionadoImagen(p.id)} />
                    ) : (
                      <div style={{ width: 50, height: 50, backgroundColor: '#e0e0e0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, cursor: 'pointer' }} onClick={() => setProductoSeleccionadoImagen(p.id)}>Sin foto</div>
                    )}
                    <label style={{ fontSize: 11, color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}>
                      📷 Foto
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleSubirImagen(e, p.id)}
                        disabled={subiendoImagen}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </td>
                <td>{p.sku}</td>
                <td>{p.nombre}</td>
                <td>{p.marca || '-'}</td>
                <td>${p.precio}</td>
                <td>{p.categoria}</td>
                <td>
                  <button onClick={() => handleEditar(p)} style={{ background: '#3b82f6', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '4px' }}>✏️ Editar</button>
                  <button onClick={() => handleEliminar(p.id)} style={{ background: '#ef4444', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🗑️ Eliminar</button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ProductosPage;