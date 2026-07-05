import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
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
import CashierExpensesScreen from './src/Screens/CashierExpensesScreen';
import PaymentDetailScreen from './src/Screens/PaymentDetailScreen';
import PaymentMethodsScreen from './src/Screens/PaymentMethodScreen';
import PaymentCashScreen from './src/Screens/PaymentCashScreen';
import ProcessingScreen from './src/Screens/ProcessingScreen';
import ReceiptScreen from './src/Screens/ReceiptScreen';
import SideMenu from './src/Components/SideMenu';
import colors from './src/Styles/colors';
import { PRODUCTS } from './src/Data/data';

// esta version no se conecta a nada, es solo para ver las pantallas

const ROL_A_APP = {
  mesero: 'waiter',
  cocina: 'kitchen',
  cajero: 'cashier',
};

let folioSiguiente = 1010;

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [cart, setCart] = useState([]);
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

  const handleLogin = (rolBackend, nombre) => {
    const r = ROL_A_APP[rolBackend] || 'waiter';
    setRole(r);
    setUserName(nombre || '');

    if (r === 'kitchen') {
      setScreen('kitchen');
    } else if (r === 'cashier') {
      setScreen('cashier');
    } else {
      setScreen('tables');
    }
  };

  const handleLogout = () => {
    setRole(null);
    setUserName('');
    setCart([]);
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

  const handleSendToKitchen = () => {
    if (cart.length === 0) return;
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const folio = String(folioSiguiente++);
    const pedido = {
      id: Number(folio),
      folio,
      fecha_hora: new Date().toISOString(),
      estatus: 'pendiente',
      subtotal,
      descuento: 0,
      total: subtotal,
      id_mesa: selectedTable,
      nombre_usuario: userName || 'Mesero',
      nombre_promocion: null,
      detalles: cart.map((item, i) => ({
        id: i + 1,
        id_producto: item.id,
        nombre_producto: item.name,
        cantidad: item.qty,
        observaciones: item.notes || (item.options && item.options.join(', ')) || null,
        subtotal: item.price * item.qty,
      })),
    };
    setPedidoActivo(pedido);
    setCart([]);
    setScreen('order-tracking');
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
        products={PRODUCTS}
        selectedTable={selectedTable}
        userName={userName}
      />
    ),
    tables: (
      <TablesScreen
        role={role}
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
        pedido={selectedKitchenPedido}
      />
    ),
    ingredients: (
      <IngredientsScreen
        onNavigate={navigate}
        onOpenMenu={() => setMenuOpen(true)}
        role={role}
      />
    ),
    cashier: (
      <CashierScreen
        onNavigate={navigate}
        onOpenMenu={() => setMenuOpen(true)}
        role={role}
      />
    ),
    'cashier-history': (
      <CashierHistoryScreen
        onNavigate={navigate}
        onOpenMenu={() => setMenuOpen(true)}
      />
    ),
    'cashier-expenses': (
      <CashierExpensesScreen
        onNavigate={navigate}
        onOpenMenu={() => setMenuOpen(true)}
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
        pedido={selectedCashierPedido}
        onPagoRegistrado={setUltimoTicket}
      />
    ),
    'payment-cash': (
      <PaymentCashScreen
        onNavigate={navigate}
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
