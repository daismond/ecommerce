import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProductCatalogPage from './pages/ProductCatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';

// Placeholder pages for routing
const HomePage = () => <h1 className="text-3xl font-bold">Home Page</h1>;
const CartPage = () => <h1 className="text-3xl font-bold">Cart Page</h1>;
const LoginPage = () => <h1 className="text-3xl font-bold">Login Page</h1>;
const NotFoundPage = () => <h1 className="text-3xl font-bold">404 - Page Not Found</h1>;

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductCatalogPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;