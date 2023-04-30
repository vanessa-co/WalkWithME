import bcrypt
import uuid
from datetime import datetime
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
from email_validator import validate_email, EmailNotValidError
from sqlalchemy_serializer import SerializerMixin



class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    profile_photo = db.Column(db.String, nullable=True)
    walks = db.relationship('Walk', back_populates='user', lazy=True)
    reviews = db.relationship('Review', back_populates='user', lazy=True)
    followed = association_proxy('followed_assoc', 'followed')
    followers = association_proxy('followers_assoc', 'follower')


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
    
    def get_profile_photo_url(self):
        if self.profile_photo:
            return f'/users/{self.id}/profile_photo'
        return None

    def to_dict(self, include_followers=False):
        user_data = {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "profile_photo": self.get_profile_photo_url(),
        }
        if include_followers:
            user_data["followers"] = [follower.to_dict() for follower in self.followers]
        return user_data


    def get_followers(self):
        return [follower.to_dict() for follower in self.followers]
    
    def get_followed(self):
        return [followed.to_dict() for followed in self.followed]




class Walk(db.Model, SerializerMixin):
    __tablename__ = 'walks'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, default='Unnamed Walk')
    location = db.Column(db.String(120), nullable=False)
    distance = db.Column(db.Float, nullable=False)
    photo = db.Column(db.String, nullable=True)
    description = db.Column(db.String(255), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='walks')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "distance": self.distance,
            "photo": self.photo,
            "description": self.description,
            "username": self.user.username,
        }

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    id = db.Column(db.String(36), primary_key=True, default=str(uuid.uuid4()))
    text = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    walk_id = db.Column(db.Integer, db.ForeignKey('walks.id'), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    comment = db.Column(db.String(255), nullable=True)
    user = db.relationship('User', back_populates='reviews')

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "username": self.user.username,
            "walk_id": self.walk_id,
            "rating": self.rating,
            "comment": self.comment,

        }

class Follow(db.Model, SerializerMixin):
    __tablename__ = 'follows'

    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    followed_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    follower = db.relationship('User', foreign_keys=[follower_id], backref=db.backref('followers_assoc', lazy='dynamic'))
    followed = db.relationship('User', foreign_keys=[followed_id], backref=db.backref('followed_assoc', lazy='dynamic'))


    def __repr__(self):
        return f'<Follow {self.follower_id} is following {self.followed_id}>'

    def to_dict(self):
        return {
            "id": self.id,
            "follower": self.follower_id,
            "followed": self.followed_id,
        }

