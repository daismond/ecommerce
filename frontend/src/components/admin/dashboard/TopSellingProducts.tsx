import React, { useState, useEffect } from 'react';
import apiClient from '../../../services/api';
import type { TopSellingProduct } from '../../../types/reports';

const TopSellingProducts: React.FC = () => {
  const [products, setProducts] = useState<TopSellingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<TopSellingProduct[]>('/admin/reports/top-selling')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading top sellers...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-bold text-lg mb-4">Top Selling Products</h3>
      <ul className="divide-y divide-gray-200">
        {products.map(({ product, total_quantity_sold }) => (
          <li key={product.id} className="py-2 flex justify-between">
            <span>{product.title}</span>
            <span className="font-semibold">{total_quantity_sold} sold</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopSellingProducts;