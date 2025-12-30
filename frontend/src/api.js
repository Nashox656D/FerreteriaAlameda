// api.js - funciones para conectar con el backend Django

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';

function _getAuthHeaders() {
  try {
    const token = localStorage.getItem('ticashop_token');
    if (token) return { 'Authorization': `Token ${token}` };
  } catch (e) {
    // ignore
  }
  return {};
}

export async function fetchProductos() {
  const headers = _getAuthHeaders();
  const res = await fetch(API_URL + 'productos/', { headers });
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorData || res.statusText}`);
  }
  return res.json();
}

export async function crearProducto(data) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, _getAuthHeaders());
  const res = await fetch(API_URL + 'productos/', {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al crear producto');
  return res.json();
}

export async function getUserInfo(token) {
  const res = await fetch(API_URL + 'user/', {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!res.ok) return null;
  return res.json();
}

export function getUserRole(userInfo) {
  if (!userInfo) return null;
  if (userInfo.is_superuser) return 'admin';
  if (userInfo.cargo && ['Recursos Humanos', 'Admin'].includes(userInfo.cargo)) return 'admin';
  if (userInfo.cargo && userInfo.cargo === 'Empleado') return 'empleado';
  return 'cliente';
}