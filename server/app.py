import jwt
from datetime import datetime, timedelta
import secrets
from flask import request, jsonify, session, send_from_directory
from flask_restful import Resource
from models import User, Walk, Review, Follow
from config import app, api, db
import bcrypt
from werkzeug.utils import secure_filename
import os
from flask_login import LoginManager, login_user, logout_user, login_required 

SECRET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2ODMxMjcwOTl9.11dgLQ5_-YkqCDUPa5R-3KUhzc6kak3wh-5QOpyaAb4'
EXPIRATION_TIME = 60 * 60 * 24

app.config["SECRET_KEY"] = secrets.token_hex(16)



login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)



def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(seconds=EXPIRATION_TIME),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')



login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)



class Home(Resource):
    def get(self):
        return 'HomePage'

       
api.add_resource(Home, '/')



class UserResource(Resource):
    def get(self, user_id=None):
        if user_id:
            user = User.query.get(user_id)
            return user.to_dict(include_followers=True) if user else {"error": "User not found"}, 404
        users = User.query.all()
        return [user.to_dict() for user in users]

    def post(self):
        username = request.json.get('username')
        email = request.json.get('email')
        password = request.json.get('password')
        profile_photo = request.json.get('profile_photo')

        if not username or not email or not password:
            return {"error": "Username, email, and password are required fields"}, 400

        user = User.query.filter_by(email=email).first()
        if user:
            return {"error": "Email already in use"}, 400

        user = User(username=username, email=email, password=password, profile_photo=profile_photo)
        db.session.add(user)
        db.session.commit()

        return {"message": "User created successfully"}, 201

    def delete(self, user_id):
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return {"message": "User deleted successfully"}
        return {"error": "User not found"}, 404

api.add_resource(UserResource, '/users', '/users/<int:user_id>')



class AllUsersResource(Resource):
    def get(self):
        users = User.query.all()
        return [user.to_dict() for user in users]

api.add_resource(AllUsersResource, '/api/users')





class WalkResource(Resource):
    def get(self, walk_id=None):
        if walk_id:
            walk = Walk.query.get(walk_id)
            return walk.to_dict() if walk else {"error": "Walk not found"}, 404
        walks = Walk.query.all()
        return [walk.to_dict() for walk in walks]

    def post(self):
        data = request.json

        required_fields = ['name', 'location', 'distance', 'user_id']
        if not all(field in data for field in required_fields):
            return {"error": "Name, location, distance, and user_id are required fields"}, 400

        walk = Walk(name=data['name'], location=data['location'], distance=data['distance'], photo=data.get('photo', None), user_id=data['user_id'])
        db.session.add(walk)
        db.session.commit()

        return walk.to_dict(), 201

    def patch(self, walk_id):
        walk = Walk.query.get(walk_id)
        if not walk:
         return {"error": "Walk not found"}, 404

        data = request.json

        walk.name = data.get('name', walk.name)
        walk.location = data.get('location', walk.location)
        walk.distance = data.get('distance', walk.distance)
        walk.photo = data.get('photo', walk.photo)
    # walk.description = data.get('description', walk.description)

        db.session.commit()

        return walk.to_dict(), 200  # Return the updated walk data







    def delete(self, walk_id):
        walk = Walk.query.get(walk_id)
        if not walk:
            return {"error": "Walk not found"}, 404

        db.session.delete(walk)
        db.session.commit()

        return {"message": "Walk deleted successfully"}, 200

api.add_resource(WalkResource, '/walks', '/walks/<int:walk_id>')


class UserProfilePhotoResource(Resource):
    def post(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        if 'file' not in request.files:
            return {"error": "No file provided"}, 400

        file = request.files['file']
        if file.filename == '':
            return {"error": "No file selected"}, 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            user.profile_photo = filename
            db.session.commit()
            return {"message": "Profile photo uploaded successfully"}, 201
        else:
            return {"error": "File type not allowed"}, 400

    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        if not user.profile_photo:
            return {"error": "No profile photo found"}, 404

        return send_from_directory(app.config['UPLOAD_FOLDER'], user.profile_photo)

api.add_resource(UserProfilePhotoResource, '/users/<int:user_id>/profile_photo')


class ReviewsResource(Resource):
    def get(self):
        reviews = Review.query.all()
        return [review.to_dict() for review in reviews]

    def post(self):
        data = request.get_json()
        new_review = Review(
            text=data['text'],
            user_id=data['user_id'],
            event_name=data['event_name'],
            rating=data['rating'],
            location=data['location'],
            date=data['date'],
            time=data['time'],
            category=data['category']
        )
        db.session.add(new_review)
        db.session.commit()
        return new_review.to_dict(), 201

class ReviewResource(Resource):
    def get(self, review_id):
        review = Review.query.get_or_404(review_id)
        return review.to_dict()

    def patch(self, review_id):
        data = request.get_json()
        review = Review.query.get_or_404(review_id)
        for key, value in data.items():
            setattr(review, key, value)
        db.session.commit()
        return review.to_dict()

    def delete(self, review_id):
        review = Review.query.get_or_404(review_id)
        db.session.delete(review)
        db.session.commit()
        return {}, 204

api.add_resource(ReviewsResource, '/api/reviews')
api.add_resource(ReviewResource, '/api/reviews/<int:review_id>')










class FollowedResource(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404
        followed = [{"id": f.followed.id, "username": f.followed.username, "profile_photo": f.followed.get_profile_photo_url(), "follower_username": f.follower.username} for f in user.followed_assoc]
        return followed

api.add_resource(FollowedResource, '/api/users/<int:user_id>/followed')


class FollowerResource(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404
        followers = [{"id": f.follower.id, "username": f.follower.username, "profile_photo": f.follower.get_profile_photo_url(), "followed_username": f.followed.username} for f in user.followers_assoc]
        return followers

api.add_resource(FollowerResource, '/api/users/<int:user_id>/followers')


class FollowResource(Resource):
    def post(self, user_id, followed_id):
        user = User.query.get(user_id)
        followed_user = User.query.get(followed_id)

        if not user or not followed_user:
            return {"error": "User not found"}, 404

        follow = Follow.query.filter_by(follower_id=user_id, followed_id=followed_id).first()

        if follow:
            return {"error": "Already following"}, 400

        new_follow = Follow(
            follower_id=user_id,
            followed_id=followed_id,
            follower_username=user.username,
            followed_username=followed_user.username,
        )

        db.session.add(new_follow)
        db.session.commit()

        return new_follow.to_dict(), 201

api.add_resource(FollowResource, '/api/users/<int:user_id>/follow/<int:followed_id>')





class SignUpFollowResource(Resource):
    def post(self, user_id, followed_id):
        user = User.query.get(user_id)
        followed_user = User.query.get(followed_id)

        if not user or not followed_user:
            return {"error": "User not found"}, 404

        follow = Follow.query.filter_by(follower_id=user_id, followed_id=followed_id).first()

        if follow:
            return {"error": "Already following"}, 400

        new_follow = Follow(
            follower_id=user_id,
            followed_id=followed_id,
            follower_username=user.username,
            followed_username=followed_user.username,
        )

        db.session.add(new_follow)
        db.session.commit()

        return new_follow.to_dict(), 201

api.add_resource(SignUpFollowResource, '/api/users/<int:user_id>/signup_follow/<int:followed_id>')







class UnfollowResource(Resource):
    def delete(self, user_id, followed_id):
        follow = Follow.query.filter_by(follower_id=user_id, followed_id=followed_id).first()

        if not follow:
            return {"error": "Not following"}, 404

        db.session.delete(follow)
        db.session.commit()

        return {"message": "Unfollowed"}, 200

api.add_resource(UnfollowResource, '/api/users/<int:user_id>/unfollow/<int:followed_id>')








@app.route('/auth', methods=['POST'])
def auth():
    action = request.json.get('action')
    username = request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')

    if not username or not password:
        return {"error": "Username and password are required"}, 400

    if action == 'login':
        user = User.query.filter_by(username=username).first()
        if not user or not user.check_password(password):
            return {"error": "Invalid credentials"}, 401

        token = generate_token(user.id)

        user_followers = [follow.follower.to_dict() for follow in user.followers_assoc]
        user_followed = [follow.followed.to_dict() for follow in user.followed_assoc]

        user_data = user.to_dict()
        user_data['followers'] = user_followers
        user_data['followed'] = user_followed

        return {"message": "Logged in successfully", "user": user_data, "token": token}, 200
    elif action == 'signup':
        if not email:
            return {"error": "Email is required for signup"}, 400

        user = User.query.filter_by(username=username).first()
        if user:
            return {"error": "Username already exists"}, 409

        user = User.query.filter_by(email=email).first()
        if user:
            return {"error": "Email already exists"}, 409

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(username=username, email=email, password_hash=hashed_password)
        db.session.add(user)
        db.session.commit()

        token = generate_token(user.id)

        user_followers = [follow.follower.to_dict() for follow in user.followers_assoc]
        user_followed = [follow.followed.to_dict() for follow in user.followed_assoc]

        user_data = user.to_dict()
        user_data['followers'] = user_followers
        user_data['followed'] = user_followed

        return {"message": "User created successfully", "user": user_data, "token": token}, 201
    else:
        return {"error": "Invalid action"}, 400








@app.route('/logout', methods=['POST'])
def logout():
    # Clear the session data
    session.clear()
    return {"message": "Logged out successfully"}, 200



if __name__ == '__main__':
    app.run(port=5555, debug=True)









