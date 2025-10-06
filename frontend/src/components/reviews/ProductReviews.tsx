import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../services/api';
import type { Review } from '../../types/review';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const response = await apiClient.get<Review[]>(`/products/${productId}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      {reviews.length > 0 ? (
        <>
          <div className="flex items-center mb-6">
            <StarRating rating={averageRating} />
            <span className="ml-2 text-gray-600">
              {averageRating.toFixed(1)} out of 5 ({reviews.length} reviews)
            </span>
          </div>
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <StarRating rating={review.rating} />
                  <p className="ml-4 font-semibold">{review.user.first_name || 'Anonymous'}</p>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No reviews yet. Be the first to review this product!</p>
      )}
      <ReviewForm productId={productId} onReviewSubmit={fetchReviews} />
    </div>
  );
};

export default ProductReviews;