import bcrypt
import uuid
from datetime import datetime
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
from email_validator import validate_email, EmailNotValidError

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    walks = db.relationship('Walk', back_populates='user', lazy=True)
    reviews = db.relationship('Review', back_populates='user', lazy=True)

    def __init__(self, username, email, password=None, password_hash=None):
        self.username = username
        self.email = email
        if password:
            self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        elif password_hash:
            self.password_hash = password_hash
        else:
            raise ValueError("Either 'password' or 'password_hash' argument must be provided")

    @validates('email')
    def validate_email(self, key, email):
        try:
            validate_email(email)
        except EmailNotValidError:
            raise ValueError('Invalid email address')
        return email

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }

class Walk(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, default='Unnamed Walk')
    location = db.Column(db.String(120), nullable=False)
    distance = db.Column(db.Float, nullable=False)
    photo = db.Column(db.String, nullable=True)
    description = db.Column(db.String(255), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='walks')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "distance": self.distance,
            "photo": self.photo,
            "description": self.description,
            "username": self.user.username,  # Display the user's name instead of user_id
        }


        

class Review(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=str(uuid.uuid4())) 
    text = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    walk_id = db.Column(db.Integer, db.ForeignKey('walk.id'), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    comment = db.Column(db.String(255), nullable=True)
    user = db.relationship('User', back_populates='reviews')

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "username": self.user.username,  # Display the user's name instead of user_id
            "walk_id": self.walk_id,
            "rating": self.rating,
            "comment": self.comment,
        }

class Follow(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    followed_id = db.Column


    def to_dict(self):
        return {
            "id": self.id,
            "follower_id": self.follower_id,
            "followed_id": self.followed_id,
          
        }

