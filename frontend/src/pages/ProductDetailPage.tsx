import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from '../components/products/ProductDetail';
import ProductReviews from '../components/reviews/ProductReviews';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();

  return (
    <div>
      <ProductDetail />
      {productId && <ProductReviews productId={productId} />}
    </div>
  );
};

export default ProductDetailPage;