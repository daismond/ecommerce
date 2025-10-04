import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProductCatalogPage from './pages/ProductCatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Placeholder pages for routing
const HomePage = () => <h1 className="text-3xl font-bold">Home Page</h1>;
const LoginPage = () => <h1 className="text-3xl font-bold">Login Page</h1>;
const NotFoundPage = () => <h1 className="text-3xl font-bold">404 - Page Not Found</h1>;

import AdminProductListPage from './pages/admin/AdminProductListPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';

// Admin placeholder pages
const AdminDashboard = () => <h2>Admin Dashboard</h2>;
const AdminOrders = () => <h2>Admin Orders</h2>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductCatalogPage />} />
              <Route path="/products/:productId" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        } />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/*" element={
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProductListPage />} />
                <Route path="products/new" element={<AdminProductFormPage />} />
                <Route path="products/edit/:productId" element={<AdminProductFormPage />} />
                <Route path="orders" element={<AdminOrders />} />
              </Routes>
            </AdminLayout>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;