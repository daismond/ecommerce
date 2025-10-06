import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProductCatalogPage from './pages/ProductCatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserProtectedRoute from './components/auth/UserProtectedRoute';
import AccountLayout from './components/account/AccountLayout';
import LoginPage from './pages/LoginPage';

// Placeholder pages for routing
const HomePage = () => <h1 className="text-3xl font-bold">Home Page</h1>;
const NotFoundPage = () => <h1 className="text-3xl font-bold">404 - Page Not Found</h1>;

import AdminProductListPage from './pages/admin/AdminProductListPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminOrderListPage from './pages/admin/AdminOrderListPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCustomerListPage from './pages/admin/AdminCustomerListPage';

import UserOrderListPage from './pages/account/UserOrderListPage';
import UserOrderDetailPage from './pages/account/UserOrderDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public and User Account Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductCatalogPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<UserProtectedRoute />}>
            <Route path="/account" element={<AccountLayout />}>
              <Route index element={<Navigate to="orders" />} />
              <Route path="orders" element={<UserOrderListPage />} />
              <Route path="orders/:orderId" element={<UserOrderDetailPage />} />
            </Route>
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductListPage />} />
            <Route path="products/new" element={<AdminProductFormPage />} />
            <Route path="products/edit/:productId" element={<AdminProductFormPage />} />
            <Route path="orders" element={<AdminOrderListPage />} />
            <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
            <Route path="customers" element={<AdminCustomerListPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        {/* A top-level Not Found for routes that don't match /admin/* or other top-level paths */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
