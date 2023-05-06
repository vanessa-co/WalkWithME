import { useReviewsContext } from '../contexts/ReviewsContext';

const Reviews = ({ loggedInUserId }) => {
  const {
    reviews,
    editingReviewId,
    formValues,
    handleChange,
    handleSubmit,
    handleEdit,
    setEditingReviewId,
  } = useReviewsContext();

  return (
    <div>
      <h1>Reviews</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="text">Review:</label>
        <input
          type="text"
          name="text"
          value={formValues.text}
          onChange={handleChange}
          required
        />
        <label htmlFor="rating">Rating:</label>
        <input
          type="number"
          name="rating"
          value={formValues.rating}
          onChange={handleChange}
          min="1"
          max="5"
          required
        />
        <label htmlFor="category">Category:</label>
        <select
          name="category"
          value={formValues.category}
          onChange={handleChange}
          required
        >
          <option value="">Choose a category</option>
          <option value="leisure">Leisure</option>
          <option value="competitive">Competitive</option>
          <option value="charity">Charity</option>
        </select>
        <button type="submit">{editingReviewId ? 'Update' : 'Add'} Review</button>
      </form>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <p>
              <strong>{review.username}:</strong> {review.text} ({review.rating})
            </p>
            {loggedInUserId === review.user_id && (
              <button onClick={() => handleEdit(review)}>Edit</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;
