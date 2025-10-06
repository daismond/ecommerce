import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/api';
import type { Product } from '../../types/product';
import type { ProductVariant } from '../../types/product-variant';
import { useCart } from '../../context/CartContext';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Product>(`/products/${productId}`);
        setProduct(response.data);
        if (response.data.variants.length > 0) {
          setSelectedVariant(response.data.variants[0]);
        }
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

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(selectedVariant.id, 1);
      alert(`${product?.title} (${Object.values(selectedVariant.attributes).join(', ')}) added to cart!`);
    } else {
      alert('Please select a variant first.');
    }
  };

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
      <div className="bg-gray-200 h-96 flex items-center justify-center rounded-lg">
        <span className="text-gray-500">Product Image Gallery</span>
      </div>

      <div>
        <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
        <p className="text-gray-600 mb-6">{product.short_description}</p>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Variants</h2>
          <div className="flex flex-wrap gap-2">
            {product.variants.map(variant => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`px-4 py-2 border rounded-lg ${selectedVariant?.id === variant.id ? 'border-blue-600 bg-blue-100' : 'border-gray-300'}`}
              >
                {Object.values(variant.attributes).join(' / ')}
              </button>
            ))}
          </div>
        </div>

        <div className="my-6">
          <p className="text-3xl font-bold">${selectedVariant?.price || '0.00'}</p>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400"
          disabled={!selectedVariant}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;