
import { useState, useEffect } from 'react';
import { useReviews } from '../contexts/ReviewsContext';
import ReviewForm from './ReviewForm';
import ReactStars from "react-rating-stars-component";
import { Card, Col, Container, Row, Form, Button } from 'react-bootstrap'

const Reviews = () => {
  const { reviews, setReviews } = useReviews();
  const [filteredReviews, setFilteredReviews] = useState(reviews);
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetch('/api/reviews')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setReviews(data))
      .catch(error => console.error('Error fetching reviews:', error));
  }, [setReviews]);

  useEffect(() => {
    if (filterCategory) {
      setFilteredReviews(reviews.filter(review => review.category.toLowerCase() === filterCategory.toLowerCase()));
    } else {
      setFilteredReviews(reviews);
    }
  }, [filterCategory, reviews]);

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };


  return (
    <Container>
      <h2></h2>
      <ReviewForm />
      <Form.Group controlId="filterCategory" className="mb-3">
        <Form.Label>Filter by category:</Form.Label>
        <Form.Control as="select" value={filterCategory} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="leisure">Leisure</option>
          <option value="athletic">Athletic</option>
          <option value="charity">Charity</option>
        </Form.Control>
      </Form.Group>
      <Row>
        {filteredReviews.map(review => (
          <Col key={review.id} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{review.event_name}</Card.Title>
                <ReactStars
                  count={5}
                  value={review.rating}
                  size={24}
                  edit={false}
                  activeColor="#ffd700"
                />
                <Card.Text>{review.text}</Card.Text>
                <p><strong>Location:</strong> {review.location}</p>
                <p><strong>Category:</strong> {review.category}</p>
                <p><strong>Username:</strong> {review.username}</p>
                <p><strong>Date:</strong> {review.date}</p>
                <p><strong>Time:</strong> {review.time}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Reviews;





