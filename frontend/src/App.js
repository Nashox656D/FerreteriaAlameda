import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { fetchProductos, crearProducto } from './api';
import './App.css';
import Login from './Login';
import ProductosPage from './ProductosPage';
import ClientesPage from './ClientesPage';
import ProveedoresPage from './ProveedoresPage';
import StockPage from './StockPage';
import FacturasPage from './FacturasPage';
import ReportesPage from './ReportesPage';
import DefectosPage from './DefectosPage';
import BarcodeScanner from './BarcodeScanner';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';
const COMPANY_NAME = process.env.REACT_APP_COMPANY_NAME || 'Ferreteria Alameda';

function App() {
  const [buscaStock, setBuscaStock] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState('productos');
  // Productos
  const [productos, setProductos] = useState([]);
  const [nuevo, setNuevo] = useState({ sku: '', nombre: '', precio: '', categoria: '' });
  // Clientes
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', rut: '', email: '' });
  // Stock
  const [stock, setStock] = useState([]);
  const [nuevoStock, setNuevoStock] = useState({ producto: '', cantidad: '' });
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  // Facturas
  const [facturas, setFacturas] = useState([]);
  const [nuevaFactura, setNuevaFactura] = useState({ numero: '', cliente: '', monto: '' });
  // Errores
  const [error, setError] = useState('');

  // On mount, restore user from localStorage token if present
  useEffect(() => {
    const token = (() => {
      try { return localStorage.getItem('ticashop_token'); } catch (e) { return null; }
    })();
    if (token) {
      fetch(API_URL + 'user/', { headers: { 'Authorization': `Token ${token}` } })
        .then(r => r.json())
        .then(user => {
          if (user && user.username) setUsuario({ token, username: user.username, is_superuser: user.is_superuser, cargo: user.cargo });
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    setError('');
    const headers = usuario && usuario.token ? { 'Authorization': `Token ${usuario.token}` } : {};
    
    const handleResponse = async (res) => {
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Error ${res.status}: ${errorData || res.statusText}`);
      }
      return res.json();
    };

    if (vista === 'productos') {
      fetchProductos()
        .then(setProductos)
        .catch(err => setError(`Productos: ${err.message}`));
    } else if (vista === 'clientes') {
      fetch(API_URL + 'clientes/', { headers })
        .then(handleResponse).then(setClientes)
        .catch(err => setError(`Clientes: ${err.message}`));
    } else if (vista === 'stock') {
      Promise.all([
        fetch(API_URL + 'stock/', { headers }).then(handleResponse),
        fetch(API_URL + 'productos/', { headers }).then(handleResponse)
      ]).then(([stockData, productosData]) => {
        // Cargar datos del stock con información completa del producto
        const stockConProducto = stockData.map(s => {
          const producto = productosData.find(p => p.id === s.producto);
          return { ...s, productoInfo: producto };
        });
        setStock(stockConProducto);
        setProductosDisponibles(productosData);
      }).catch(err => setError(`Stock: ${err.message}`));
    } else if (vista === 'facturas') {
      fetch(API_URL + 'facturas/', { headers })
        .then(handleResponse).then(setFacturas)
        .catch(err => setError(`Facturas: ${err.message}`));
    }
  }, [vista, usuario]);

  // Handlers productos
  const handleChange = e => setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const prod = await crearProducto({
        sku: nuevo.sku,
        nombre: nuevo.nombre,
        precio: nuevo.precio,
        categoria: nuevo.categoria,
        descripcion: '',
        activo: true
      });
      setProductos([...productos, prod]);
      setNuevo({ sku: '', nombre: '', precio: '', categoria: '' });
    } catch {
      setError('Error al crear producto');
    }
  };

  // Handlers clientes
  const handleClienteChange = e => setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value });
  const handleClienteSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const authHeaders = usuario && usuario.token ? { 'Authorization': `Token ${usuario.token}` } : {};
      const res = await fetch(API_URL + 'clientes/', {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders),
        body: JSON.stringify(nuevoCliente)
      });
      if (!res.ok) throw new Error();
      const cli = await res.json();
      setClientes([...clientes, cli]);
      setNuevoCliente({ nombre: '', rut: '', email: '' });
    } catch {
      setError('Error al crear cliente');
    }
  };

  // Handlers stock
  const handleStockChange = e => setNuevoStock({ ...nuevoStock, [e.target.name]: e.target.value });
  const handleStockSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const authHeaders = usuario && usuario.token ? { 'Authorization': `Token ${usuario.token}` } : {};
      const res = await fetch(API_URL + 'stock/', {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders),
        body: JSON.stringify(nuevoStock)
      });
      if (!res.ok) throw new Error();
      const st = await res.json();
      setStock([...stock, st]);
      setNuevoStock({ producto: '', cantidad: '' });
    } catch {
      setError('Error al agregar stock');
    }
  };

  // (Cotizaciones y Ordenes removidas para la versión admin-only)

  // Facturas
  const handleFacturaChange = e => setNuevaFactura({ ...nuevaFactura, [e.target.name]: e.target.value });
  const handleFacturaSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const authHeaders = usuario && usuario.token ? { 'Authorization': `Token ${usuario.token}` } : {};
      const res = await fetch(API_URL + 'facturas/', {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders),
        body: JSON.stringify(nuevaFactura)
      });
      if (!res.ok) throw new Error();
      const fac = await res.json();
      setFacturas([...facturas, fac]);
      setNuevaFactura({ numero: '', cliente: '', monto: '' });
    } catch {
      setError('Error al crear factura');
    }
  };

  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  // Mostrar el rol en la UI
  const cargo = usuario && usuario.cargo ? usuario.cargo : null;
  const rol = usuario && usuario.is_superuser ? 'Administrador' : (cargo || 'Empleado');

  return (
    <div className="App">
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-brand">
          <h1>🛍️ {COMPANY_NAME}</h1>
        </div>
        <div className="topbar-user">
          <div className="user-info">
            <span><b>Usuario:</b> {usuario.username}</span>
            <span><b>Rol:</b> {rol}</span>
          </div>
          <button onClick={() => { try { localStorage.removeItem('ticashop_token'); } catch(e){}; setUsuario(null); }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main container */}
      <div className="main-container">
        {/* Sidebar Navigation */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>📋 Menú</h3>
          </div>
          <nav className="sidebar-nav">
            <Link to="/scanner"><button onClick={() => setVista('scanner')} className={vista === 'scanner' ? 'active' : ''}>📱 Escáner</button></Link>
            <Link to="/productos"><button onClick={() => setVista('productos')} className={vista === 'productos' ? 'active' : ''}>📦 Productos</button></Link>
            <Link to="/clientes"><button onClick={() => setVista('clientes')} className={vista === 'clientes' ? 'active' : ''}>👥 Clientes</button></Link>
            <Link to="/proveedores"><button onClick={() => setVista('proveedores')} className={vista === 'proveedores' ? 'active' : ''}>🏢 Proveedores</button></Link>
            <Link to="/stock"><button onClick={() => setVista('stock')} className={vista === 'stock' ? 'active' : ''}>📊 Stock</button></Link>
            <Link to="/defectos"><button onClick={() => setVista('defectos')} className={vista === 'defectos' ? 'active' : ''}>⚠️ Defectos</button></Link>
              <Link to="/facturas"><button onClick={() => setVista('facturas')} className={vista === 'facturas' ? 'active' : ''}>🧾 Facturas</button></Link>
              <Link to="/reportes"><button onClick={() => setVista('reportes')} className={vista === 'reportes' ? 'active' : ''}>📈 Reportes</button></Link>
          </nav>
          <div className="sidebar-footer">
            <p style={{margin: 0, fontSize: '0.85rem', color: '#9ca3af'}}>© 2025 {COMPANY_NAME}</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          <div className="content-wrapper">
            {error && <div className="error-message">{error}</div>}
            <Routes>
        <Route path="/" element={<Navigate to="/scanner" />} />
        <Route path="/scanner" element={<BarcodeScanner />} />
            <Route path="/reportes" element={<ReportesPage usuario={usuario} />} />
        <Route path="/productos" element={<ProductosPage
          productos={productos}
          setProductos={setProductos}
          nuevo={nuevo}
          setNuevo={setNuevo}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          usuario={usuario}
        />} />
        <Route path="/clientes" element={<ClientesPage
          clientes={clientes}
          setClientes={setClientes}
          nuevoCliente={nuevoCliente}
          setNuevoCliente={setNuevoCliente}
          handleClienteSubmit={handleClienteSubmit}
          handleClienteChange={handleClienteChange}
        />} />
        <Route path="/proveedores" element={<ProveedoresPage />} />
        <Route path="/stock" element={<StockPage
          stock={stock}
          setStock={setStock}
          nuevoStock={nuevoStock}
          setNuevoStock={setNuevoStock}
          handleStockSubmit={handleStockSubmit}
          handleStockChange={handleStockChange}
          productosDisponibles={productosDisponibles}
          buscaStock={buscaStock}
          setBuscaStock={setBuscaStock}
          usuario={usuario}
        />} />
        <Route path="/facturas" element={<FacturasPage
          facturas={facturas}
          setFacturas={setFacturas}
          nuevaFactura={nuevaFactura}
          setNuevaFactura={setNuevaFactura}
          handleFacturaSubmit={handleFacturaSubmit}
          handleFacturaChange={handleFacturaChange}
        />} />
        <Route path="/defectos" element={<DefectosPage usuario={usuario} />} />
      </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
