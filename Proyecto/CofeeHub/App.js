import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Alert } from 'react-native';
import SplashScreen from './src/Screens/SplashScreen';
import LoginScreen from './src/Screens/LoginScreen';
import HomeScreen from './src/Screens/HomeScreen';
import TablesScreen from './src/Screens/TablesScreen';
import CustomizeScreen from './src/Screens/CustomizeScreen';
import PromotionsScreen from './src/Screens/PromotionsScreen';
import OrderSummaryScreen from './src/Screens/OrderSumaryScreen';
import OrderTrackingScreen from './src/Screens/OrderTrackingScreen';
import OrderReadyScreen from './src/Screens/OrderReadyScreen';
import KitchenScreen from './src/Screens/KitchenScreen';
import KitchenDetailScreen from './src/Screens/KitchenDetailScreen';
import KitchenStatusScreen from './src/Screens/KitchenStatusScreen';
import IngredientsScreen from './src/Screens/IngredientScreen';
import CashierScreen from './src/Screens/CashierScreen';
import CashierHistoryScreen from './src/Screens/CashierHistoryScreen';
import PaymentDetailScreen from './src/Screens/PaymentDetailScreen';
import PaymentMethodsScreen from './src/Screens/PaymentMethodScreen';
import PaymentCashScreen from './src/Screens/PaymentCashScreen';
import ProcessingScreen from './src/Screens/ProcessingScreen';
import ReceiptScreen from './src/Screens/ReceiptScreen';
import AdminDashboardScreen from './src/Screens/AdminDashboardScreen';
import AdminUsersScreen from './src/Screens/AdminUsersScreen';
import AdminMenuScreen from './src/Screens/AdminMenuScreen';
import AdminInventoryScreen from './src/Screens/AdminInventoryScreen';
import CashierExpensesScreen from './src/Screens/CashierExpensesScreen';
import SideMenu from './src/Components/SideMenu';
import colors from './src/Styles/colors';
import * as api from './src/Services/api';
import { getProductImage } from './src/Data/imageMap';

const ROL_BACKEND_A_APP = {
  admin: 'admin',
  mesero: 'waiter',
  cocina: 'kitchen',
  cajero: 'cashier',
};

const normalizarProducto = (p) => ({
  id: p.id,
  name: p.nombre,
  descripcion: p.descripcion,
  price: parseFloat(p.precio),
  category: p.categoria.nombre,
  estatus: p.estatus,
  img: getProductImage(p.nombre),
});

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState('');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pedidoActivo, setPedidoActivo] = useState(null);
  const [selectedKitchenPedido, setSelectedKitchenPedido] = useState(null);
  const [selectedCashierPedido, setSelectedCashierPedido] = useState(null);
  const [selectedMetodo, setSelectedMetodo] = useState(null);
  const [ultimoTicket, setUltimoTicket] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (screenName, data = null) => {
    if (screenName === 'customize' && data) {
      setSelectedProduct(data);
    }
    if (screenName === 'kitchen-detail' && data) {
      setSelectedKitchenPedido(data);
    }
    if (screenName === 'kitchen-status' && data) {
      setSelectedKitchenPedido(data);
    }
    if (screenName === 'payment-detail' && data) {
      setSelectedCashierPedido(data);
    }
    if (screenName === 'payment-cash' && data) {
      setSelectedMetodo(data);
    }
    setScreen(screenName);
  };

  const handleLogin = async (rolBackend, accessToken, nombre) => {
    const r = ROL_BACKEND_A_APP[rolBackend];
    if (!r) {
      Alert.alert('Error', 'Rol no válido');
      return;
    }
    setRole(r);
    setToken(accessToken);
    setUserName(nombre || '');

    if (r === 'waiter') {
      try {
        const productosApi = await api.getProductos(accessToken);
        setProducts(productosApi.map(normalizarProducto));
      } catch (e) {
        Alert.alert('Aviso', 'No se pudo cargar el menú: ' + e.message);
      }
    }

    if (r === 'kitchen') {
      setScreen('kitchen');
    } else if (r === 'cashier') {
      setScreen('cashier');
    } else if (r === 'admin') {
      setScreen('admin-dashboard');
    } else {
      setScreen('tables');
    }
  };

  const handleLogout = () => {
    setRole(null);
    setToken(null);
    setUserName('');
    setCart([]);
    setProducts([]);
    setSelectedTable(null);
    setSelectedProduct(null);
    setPedidoActivo(null);
    setSelectedKitchenPedido(null);
    setSelectedCashierPedido(null);
    setSelectedMetodo(null);
    setUltimoTicket(null);
    setScreen('login');
  };

  const handleSelectTable = (tableId) => {
    setSelectedTable(tableId);
    setScreen('home');
  };

  const handleFinishOrder = () => {
    setSelectedTable(null);
    setPedidoActivo(null);
    setScreen('tables');
  };

  const handleAddToCart = (product, options, notes, quantity) => {
    const item = { ...product, options: options || [], notes: notes || '', qty: quantity };
    const existingIndex = cart.findIndex(
      (p) => p.id === item.id && JSON.stringify(p.options) === JSON.stringify(item.options)
    );
    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].qty += quantity;
      setCart(newCart);
    } else {
      setCart([...cart, item]);
    }
    setScreen('home');
  };

  const handleUpdateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const handleSendToKitchen = async () => {
    if (cart.length === 0) return;
    try {
      const detalles = cart.map((item) => ({
        id_producto: item.id,
        cantidad: item.qty,
        observaciones: item.notes || (item.options && item.options.join(', ')) || null,
      }));
      const pedido = await api.crearPedido(token, selectedTable, detalles);
      setPedidoActivo(pedido);
      setCart([]);
      setScreen('order-tracking');
    } catch (e) {
      Alert.alert('No se pudo enviar el pedido', e.message);
    }
  };

  const screens = {
    splash: <SplashScreen onNext={() => setScreen('login')} />,
    login: <LoginScreen onLogin={handleLogin} />,
    home: (
      <HomeScreen
        role={role}
        onNavigate={navigate}
        onLogout={handleLogout}
        onOpenMenu={() => setMenuOpen(true)}
        cart={cart}
        products={products}
        selectedTable={selectedTable}
        userName={userName}
      />
    ),
    tables: (
      <TablesScreen
        role={role}
        token={token}
        onNavigate={navigate}
        onSelectTable={handleSelectTable}
      />
    ),
    customize: (
      <CustomizeScreen
        product={selectedProduct}
        onNavigate={navigate}
        onAddToCart={handleAddToCart}
      />
    ),
    promotions: (
      <PromotionsScreen
        onNavigate={navigate}
        onOpenMenu={() => setMenuOpen(true)}
        role={role}
        token={token}
      />
    ),
    'order-summary': (
      <OrderSummaryScreen
        cart={cart}
        onNavigate={navigate}
        onUpdateQty={handleUpdateQty}
        onSend={handleSendToKitchen}
        role={role}
        selectedTable={selectedTable}
      />
    ),
    'order-tracking': (
      <OrderTrackingScreen
        onNavigate={navigate}
        role={role}
        token={token}
        pedido={pedidoActivo}
        onPedidoActualizado={setPedidoActivo}
      />
    ),
    'order-ready': (
      <OrderReadyScreen
        onNavigate={navigate}
        onFinish={handleFinishOrder}
        pedido={pedidoActivo}
      />
    ),
    kitchen: (
      <KitchenScreen
        onNavigate={navigate}
        onOpenMenu={() => setMenuOpen(true)}
        role={role}
        token={token}
      />
    ),
    'kitchen-detail': (
      <KitchenDetailScreen
        order={selectedKitchenPedido}
        onNavigate={navigate}
      />
    ),
    'kitchen-status': (
      <KitchenStatusScreen
        onNavigate={navigate}
        token={token}
        pedido={selectedKitchenPedido}
      />
    ),
    ingredients: (
      <IngredientsScreen
        onNavigate={navigate}
        onOpenMenu={() => setMenuOpen(true)}
        role={role}
        token={token}
      />
    ),
    cashier: (
      <CashierScreen
        onNavigate={navigate}
        onOpenMenu={() => setMenuOpen(true)}
        role={role}
        token={token}
      />
    ),
    'cashier-history': (
      <CashierHistoryScreen
        onNavigate={navigate}
        onOpenMenu={() => setMenuOpen(true)}
        token={token}
      />
    ),
    'cashier-expenses': (
      <CashierExpensesScreen
        onNavigate={navigate}
        onOpenMenu={() => setMenuOpen(true)}
        token={token}
      />
    ),
    'payment-detail': (
      <PaymentDetailScreen
        onNavigate={navigate}
        pedido={selectedCashierPedido}
      />
    ),
    'payment-methods': (
      <PaymentMethodsScreen
        onNavigate={navigate}
        token={token}
        pedido={selectedCashierPedido}
        onPagoRegistrado={setUltimoTicket}
      />
    ),
    'payment-cash': (
      <PaymentCashScreen
        onNavigate={navigate}
        token={token}
        pedido={selectedCashierPedido}
        metodo={selectedMetodo}
        onPagoRegistrado={setUltimoTicket}
      />
    ),
    processing: (
      <ProcessingScreen
        onNavigate={navigate}
      />
    ),
    receipt: (
      <ReceiptScreen
        onNavigate={navigate}
        ticket={ultimoTicket}
        pedido={selectedCashierPedido}
      />
    ),
    'admin-dashboard': (
      <AdminDashboardScreen onNavigate={navigate} onLogout={handleLogout} token={token} userName={userName} />
    ),
    'admin-usuarios': (
      <AdminUsersScreen onNavigate={navigate} token={token} />
    ),
    'admin-menu': (
      <AdminMenuScreen onNavigate={navigate} token={token} />
    ),
    'admin-inventario': (
      <AdminInventoryScreen onNavigate={navigate} token={token} />
    ),
  };

  const renderScreen = () => {
    return screens[screen] || screens.splash;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {renderScreen()}
      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        role={role}
        userName={userName}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
