import React, { useState, useEffect, useContext } from 'react';
import ReviewForm from './ReviewForm';


import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/system';
import OpenStreetMapLocation from './OpenStreetMapLocation';
import 'leaflet/dist/leaflet.css';
import { AuthContext } from '../contexts/AuthContext';
import Cookies from 'js-cookie';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const Form = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '600px',
  margin: theme.spacing(2),
}));

const TextFieldStyled = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const RatingStyled = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-end',
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  width: '100%',
  maxWidth: '600px',
}));

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewWalkId, setReviewWalkId] = useState('');
  const [editReviewId, setEditReviewId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const addReview = async (newReview) => {
    try {
      const response = await fetch('/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newReview,
          user_id: user.id,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error submitting review: ${response.statusText}`);
      }
  
      const data = await response.json();
      setReviews([...reviews, data]);
    } catch (error) {
      console.error(error);
    }
  };
  
    const editReview = async (id, updatedReview) => {
    try {
      const response = await fetch(`/reviews/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('auth_token')}`,
        },
        body: JSON.stringify({
          ...updatedReview,
          user_id: user.id,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error updating review: ${response.statusText}`);
      }
  
      const data = await response.json();
      setReviews(reviews.map((review) => (review.id === id ? data : review)));
    } catch (error) {
      console.error(error);
    }
  };
  
  const deleteReview = async (id) => {
    try {
      const response = await fetch(`/reviews/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error deleting review: ${response.statusText}`);
      }

      setReviews(reviews.filter((review) => review.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newReview = {
      text: reviewText,
      rating: reviewRating,
      user_id: user.id,
      comment: reviewComment,
      walk_id: 1,
    };
    try {
      await addReview(newReview);
      setReviewText('');
      setReviewRating('');
      setReviewComment('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id, text, rating, comment) => {
    setEditReviewId(id);
    setReviewText(text);
    setReviewRating(rating);
    setReviewComment(comment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditReviewId(null);
    setReviewText('');
    setReviewRating('');
    setReviewComment('');
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    const updatedReview = {
      id: editReviewId,
      comment: reviewText,
      rating: reviewRating,
      user_id: user.id,
      location: reviewComment,
    };
    
    try {
      await editReview(editReviewId, updatedReview);
      setOpenDialog(false);
      setEditReviewId(null);
      setReviewText('');
      setReviewRating('');
      setReviewComment('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
    } catch (error) {
      console.error(error);
    }
  };




  return (
    <Container>
      <Typography variant="h4" gutterBottom>
      Community Reviews and Events 
     </Typography>
    <ReviewForm onSubmit={addReview} />
      <Typography variant="h4" gutterBottom>
        ...
      </Typography>
      <Form onSubmit={handleSubmit}>
        <TextFieldStyled
          label="Review"
          multiline
          rows={6}
          value={reviewText}
          onChange={(event) => setReviewText(event.target.value)}
        />
        <RatingStyled>
          <Typography>Rating:</Typography>
          <Rating
            value={reviewRating}
            onChange={(event, newValue) => setReviewRating(newValue)}
            size="large"
            precision={1}
          />
        </RatingStyled>
        <TextFieldStyled
          label="Location"
          value={reviewComment}
          onChange={(event) => setReviewComment(event.target.value)}
        />
        <SubmitButton type="submit" variant="contained" color="primary">
          Submit Review
        </SubmitButton>
      </Form>
      <Typography variant="h5" gutterBottom>
        All Reviews
      </Typography>
      {reviews.map((review) => (
        <PaperStyled key={review.id}>
          <Typography variant="h6">Review by User {review.user_id}</Typography>
          <Rating value={review.rating} readOnly />
          <Typography>{review.text}</Typography>
          {review.comment && review.comment.lat && review.comment.lng && (
            <>
              <Typography>
                Location: {review.comment.lat}, {review.comment.lng}
              </Typography>
              <OpenStreetMapLocation location={review.location} />
            </>
          )}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleEdit(review.id, review.text, review.rating, review.comment)}
          >
            Edit Review
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDelete(review.id)}
            style={{ marginLeft: '1rem' }}
          >
            Delete Review
          </Button>
        </PaperStyled>
      ))}
      {editReviewId !== null && (
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>Edit Review</DialogTitle>
          <DialogContent>
            <Form onSubmit={handleSaveEdit}>
              <TextFieldStyled
                label="Edit Review"
                multiline
                rows={6}
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
              />
              <RatingStyled>
                <Typography>Rating:</Typography>
                <Rating
                  value={reviewRating}
                  onChange={(event, newValue) => setReviewRating(newValue)}
                  size="large"
                  precision={1}
                />
              </RatingStyled>
              <TextFieldStyled
                label="Location"
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
              />
              <DialogActions>
                <SubmitButton type="submit" variant="contained" color="primary">
                  Save Edit
                </SubmitButton>
                <Button
                  variant="outlined"
                  onClick={handleCloseDialog}
                  style={{ marginLeft: '1rem' }}
                >
                  Cancel Edit
                </Button>
              </DialogActions>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </Container>
  );
}

export default Reviews;