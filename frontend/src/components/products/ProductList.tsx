import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { Product } from '../../types/product';
import ProductCard from './ProductCard';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Product[]>('/products/');
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center text-xl">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;