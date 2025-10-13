import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import RegisterPage from './pages/RegisterPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Admin imports
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/DashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import ProductCreatePage from './pages/admin/ProductCreatePage';
import ProductEditPage from './pages/admin/ProductEditPage';
import CategoryCreatePage from './pages/admin/CategoryCreatePage';
import CategoryEditPage from './pages/admin/CategoryEditPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main application layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders" element={<OrderHistoryPage />} />
          </Route>
        </Route>

        {/* Admin Section */}
        <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductManagementPage />} />
            <Route path="products/new" element={<ProductCreatePage />} />
            <Route path="products/edit/:id" element={<ProductEditPage />} />
            <Route path="categories" element={<CategoryManagementPage />} />
            <Route path="categories/new" element={<CategoryCreatePage />} />
            <Route path="categories/edit/:id" element={<CategoryEditPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
