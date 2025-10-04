import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/api';
import { Product } from '../../types/product';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Product>(`/products/${productId}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div className="text-center text-xl">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center text-xl">Product not found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image Gallery Placeholder */}
      <div className="bg-gray-200 h-96 flex items-center justify-center rounded-lg">
        <span className="text-gray-500">Product Image Gallery</span>
      </div>

      {/* Product Info */}
      <div>
        <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
        <p className="text-gray-600 mb-6">{product.short_description}</p>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{product.description || 'No description available.'}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Variants</h2>
          <div className="space-y-4">
            {product.variants.map(variant => (
              <div key={variant.id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">{Object.entries(variant.attributes).map(([key, value]) => `${key}: ${value}`).join(', ')}</p>
                  <p className="text-sm text-gray-500">SKU: {variant.sku || 'N/A'}</p>
                </div>
                <p className="text-xl font-bold">${variant.price}</p>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;