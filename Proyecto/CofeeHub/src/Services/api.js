// capa para hablar con el backend de fastapi
// ojo: si pruebas en celular fisico cambia esta ip por la de tu compu en la red local
const BASE_URL = 'http://192.168.100.18:8010';

async function request(path, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  if (!res.ok) {
    const mensaje = (data && data.detail) || 'Error al conectar con el servidor';
    throw new Error(mensaje);
  }

  return data;
}

export const login = (correo, contrasena) =>
  request('/auth/login', { method: 'POST', body: { correo, contrasena } });

export const getProductos = (token) => request('/menu/productos', { token });
export const getCategorias = (token) => request('/menu/categorias', { token });
export const getMesas = (token) => request('/mesas', { token });
export const getPromocionesActivas = (token) => request('/promociones/activas', { token });

export const crearPedido = (token, idMesa, detalles) =>
  request('/pedidos', { method: 'POST', token, body: { id_mesa: idMesa, detalles } });

export const getMisPedidos = (token) => request('/pedidos/mios', { token });
export const getPedido = (token, id) => request(`/pedidos/${id}`, { token });
export const cancelarPedido = (token, id) => request(`/pedidos/${id}/cancelar`, { method: 'PUT', token });

export const getPedidosActivos = (token) => request('/pedidos/activos', { token });
export const getPedidosListos = (token) => request('/pedidos/listos', { token });
export const cambiarEstatusPedido = (token, id, estatus) =>
  request(`/pedidos/${id}/estatus`, { method: 'PUT', token, body: { estatus } });

export const crearProducto = (token, datos) => request('/menu/productos', { method: 'POST', token, body: datos });
export const editarProducto = (token, id, datos) => request(`/menu/productos/${id}`, { method: 'PUT', token, body: datos });
export const eliminarProducto = (token, id) => request(`/menu/productos/${id}`, { method: 'DELETE', token });

export const getInventario = (token) => request('/inventario', { token });
export const getAlertasInventario = (token) => request('/inventario/alertas', { token });
export const crearIngrediente = (token, datos) => request('/inventario', { method: 'POST', token, body: datos });
export const editarIngrediente = (token, id, datos) => request(`/inventario/${id}`, { method: 'PUT', token, body: datos });
export const eliminarIngrediente = (token, id) => request(`/inventario/${id}`, { method: 'DELETE', token });

export const getMetodosPago = (token) => request('/pagos/metodos', { token });
export const getHistorialPagos = (token) => request('/pagos', { token });
export const registrarPago = (token, idPedido, idMetodo, montoRecibido) =>
  request('/pagos', { method: 'POST', token, body: { id_pedido: idPedido, id_metodo: idMetodo, monto_recibido: montoRecibido } });
export const getTicket = (token, idPedido) => request(`/pagos/${idPedido}`, { token });

export const getGastos = (token) => request('/gastos', { token });
export const getCategoriasGasto = (token) => request('/gastos/categorias', { token });
export const registrarGasto = (token, descripcion, monto, idCategoria) =>
  request('/gastos', { method: 'POST', token, body: { descripcion, monto, id_categoria_gast: idCategoria } });

export const getUsuarios = (token) => request('/usuarios', { token });
export const getRoles = (token) => request('/roles', { token });
export const crearUsuario = (token, datos) => request('/usuarios', { method: 'POST', token, body: datos });
export const editarUsuario = (token, id, datos) => request(`/usuarios/${id}`, { method: 'PUT', token, body: datos });
export const eliminarUsuario = (token, id) => request(`/usuarios/${id}`, { method: 'DELETE', token });

export const getDashboard = (token) => request('/reportes/dashboard', { token });

export const ROL_A_PANTALLA = {
  admin: 'admin-dashboard',
  mesero: 'home',
  cocina: 'kitchen',
  cajero: 'cashier',
};
