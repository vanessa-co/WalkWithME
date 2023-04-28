import React, { useContext, useEffect, useState } from "react";
import { Container, Header, Icon, Card } from "semantic-ui-react";
import { ReviewsContext } from "../contexts/ReviewsContext";

const Reviews = () => {
  const { reviews } = useContext(ReviewsContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [reviews]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!reviews || reviews.length === 0) {
    return <div>No reviews found.</div>;
  }

  return (
    <Container style={{ marginTop: "20px" }}>
      <Header as="h2" icon textAlign="center">
        <Icon name="comments" circular />
        <Header.Content>Reviews</Header.Content>
      </Header>
      <Card.Group>
        {reviews.map((review) => (
          <Card key={review.id}>
            <Card.Content>
              <Card.Header>{review.walk.title}</Card.Header>
              <Card.Meta>
                <span className="date">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </Card.Meta>
              <Card.Description>{review.text}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Icon name="star" color="yellow" />
              {review.rating}
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </Container>
  );
};

export default Reviews;


