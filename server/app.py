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
from flask_login import LoginManager, login_user, logout_user, login_required, current_user

SECRET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2ODMxMjcwOTl9.11dgLQ5_-YkqCDUPa5R-3KUhzc6kak3wh-5QOpyaAb4'
EXPIRATION_TIME = 60 * 60 * 24

app.config["SECRET_KEY"] = secrets.token_hex(16)

# Configure the upload folder and allowed file extensions
app.config['UPLOAD_FOLDER'] = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(seconds=EXPIRATION_TIME),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


class Home(Resource):
    def get(self):
        return 'HomePage'

       
api.add_resource(Home, '/')


class UserResource(Resource):
    def get(self, user_id=None):
        if user_id:
            user = User.query.get(user_id)
            return user.to_dict() if user else {"error": "User not found"}, 404
        else:
            users = User.query.all()
            return [user.to_dict() for user in users]

    def post(self):
        name = request.json.get('name')
        username = request.json.get('username')
        email = request.json.get('email')
        password = request.json.get('password')

        if not name or not username or not email or not password:
            return {"error": "All fields are required"}, 400

        user = User.query.filter_by(username=username).first()
        if user:
            return {"error": "Username already exists"}, 409

        user = User.query.filter_by(email=email).first()
        if user:
            return {"error": "Email already exists"}, 409

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(name=name, username=username, email=email, password_hash=hashed_password)
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

class WalkResource(Resource):
    def get(self, walk_id=None):
        if walk_id:
            walk = Walk.query.get(walk_id)
            return walk.to_dict() if walk else {"error": "Walk not found"}, 404
        walks = Walk.query.all()
        return [walk.to_dict() for walk in walks]

    def post(self):
        name = request.json.get('name')
        location = request.json.get('location')
        description = request.json.get('description')
        user_id = request.json.get('user_id')

        if not name or not location or not user_id:
            return {"error": "Name, location, and user_id are required fields"}, 400

        walk = Walk(name=name, location=location, description=description, user_id=user_id)
        db.session.add(walk)
        db.session.commit()

        return {"message": "Walk created successfully"}, 201

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


class ReviewResource(Resource):
    def get(self, review_id=None):
        if review_id:
            review = Review.query.get(review_id)
            return review.to_dict() if review else {"error": "Review not found"}, 404
        reviews = Review.query.all()
        return [review.to_dict() for review in reviews]

    def post(self):
        walk_id = request.json.get('walk_id')
        user_id = request.json.get('user_id')
        text = request.json.get('text')
        rating = request.json.get('rating')
        comment = request.json.get('comment')

        if not walk_id or not user_id or rating is None:
            return {"error": "walk_id, user_id, and rating are required fields"}, 400

        review = Review(walk_id=walk_id, user_id=user_id, text=text, rating=rating, comment=comment )
        db.session.add(review)
        db.session.commit()

        return {"message": "Review created successfully"}, 201
    



api.add_resource(ReviewResource, '/reviews')

class ReviewByIdResource(Resource):
    def patch(self, review_id):
        review = Review.query.get(review_id)
        if review:
            updated_data = request.json
            if 'rating' in updated_data:
                review.rating = updated_data['rating']
            if 'text' in updated_data:
                review.comment = updated_data['text']
            db.session.commit()
            return review.to_dict()
        return {'error': 'Review not found'}, 404

    def delete(self, review_id):
        review = Review.query.get(review_id)
        if review:
            db.session.delete(review)
            db.session.commit()
            return {'result': 'Review deleted'}
        return {'error': 'Review not found'}, 404

    

api.add_resource(ReviewByIdResource, '/reviews/<int:review_id>')



class FollowResource(Resource):
    def get(self, follow_id=None):
        if follow_id:
            follow = Follow.query.get(follow_id)
            return follow.to_dict() if follow else {"error": "Follow not found"}, 404
        follows = Follow.query.all()
        return [follow.to_dict() for follow in follows]

    def post(self):
        follower_id = request.json.get('follower_id')
        followed_id = request.json.get('followed_id')

        if not follower_id or not followed_id:
            return {"error": "Follower_id and followed_id are required fields"}, 400

        follow = Follow(follower_id=follower_id, followed_id=followed_id)
        db.session.add(follow)
        db.session.commit()

        return {"message": "Follow created successfully"}, 201

api.add_resource(FollowResource, '/follows', '/follows/<int:follow_id>')



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

        user_followers = [follow.follower.to_dict() for follow in user.followers]
        user_data = user.to_dict()
        user_data['followers'] = user_followers
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

        user_followers = [follow.follower.to_dict() for follow in user.followers]
        user_data = user.to_dict()
        user_data['followers'] = user_followers

        return {"message": "User created successfully", "user": user_data, "token": token}, 201
    else:
        return {"error": "Invalid action"}, 400



@app.route('/logout', methods=['POST'])
def logout():
    # Clear the session data
    session.clear()
    return {"message": "Logged out successfully"}, 200


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    if not username or not password:
        return {"error": "Username and password are required"}, 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return {"error": "Invalid credentials"}, 401

    login_user(user)
    return {"message": "Logged in successfully", "user": user.to_dict()}, 200

@app.route('/signup', methods=['POST'])
def signup():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')

    if not username or not email or not password:
        return {"error": "All fields are required"}, 400

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

    return {"message": "User created successfully", "user": user.to_dict()}, 201


@app.route('/logout', methods=['POST'])
@login_required
def logout_user_route():
    logout_user()
    return {"message": "Logged out successfully"}, 200

if __name__ == '__main__':
    app.run(port=5555, debug=True)









