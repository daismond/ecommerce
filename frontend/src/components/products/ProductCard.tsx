import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Use the price of the first variant as the display price
  const displayPrice = product.variants[0]?.price;

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden transform transition-transform duration-300 hover:scale-105">
      <Link to={`/products/${product.id}`}>
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          {/* Placeholder for product image */}
          <span className="text-gray-500">Image</span>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {product.title}
          </h3>
          <p className="mt-2 text-xl font-bold text-gray-900">
            {displayPrice ? `$${displayPrice}` : 'N/A'}
          </p>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            View Details
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;