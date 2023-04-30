

import React, { useState } from 'react';
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
import { useReviews } from '../contexts/ReviewsContext';
import OpenStreetMapLocation from './OpenStreetMapLocation';
import 'leaflet/dist/leaflet.css';

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
  const { reviews, addReview, editReview, deleteReview } = useReviews();
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [editReviewId, setEditReviewId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newReview = {
      text: reviewText,
      rating: reviewRating,
      user_id: 2,
      location: reviewLocation,
    };
    try {
      await addReview(newReview);
      setReviewText('');
      setReviewRating('');
      setReviewLocation('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id, text, rating, location) => {
    setEditReviewId(id);
    setReviewText(text);
    setReviewRating(rating);
    setReviewLocation(location);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditReviewId(null);
    setReviewText('');
    setReviewRating('');
    setReviewLocation('');
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    const updatedReview = {
      id: editReviewId,
      text: reviewText,
      rating: reviewRating,
      user_id: 2,
      location: reviewLocation,
    };
    try {
      await editReview(editReviewId, updatedReview);
      setOpenDialog(false);
      setEditReviewId(null);
      setReviewText('');
      setReviewRating('');
      setReviewLocation('');
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
        Reviews
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
          value={reviewLocation}
          onChange={(event) => setReviewLocation(event.target.value)}
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
          {review.location && review.location.lat && review.location.lng && (
            <>
              <Typography>
                Location: {review.location.lat}, {review.location.lng}
              </Typography>
              <OpenStreetMapLocation location={review.location} />
            </>
          )}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleEdit(review.id, review.text, review.rating, review.location)}
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
                value={reviewLocation}
                onChange={(event) => setReviewLocation(event.target.value)}
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


