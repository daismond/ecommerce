import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/api';

interface ReviewFormProps {
  productId: string;
  onReviewSubmit: () => void; // Callback to refresh reviews list
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewSubmit }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      await apiClient.post(`/products/${productId}/reviews`, { rating, comment });
      setRating(0);
      setComment('');
      onReviewSubmit(); // Trigger the parent component to refetch reviews
    } catch (err) {
      setError('Failed to submit review. You may have already reviewed this product.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <p className="mt-4">You must be logged in to leave a review.</p>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Your Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                &#9733;
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block mb-2 font-semibold">Your Review</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={4}
            placeholder="Tell us what you think..."
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;