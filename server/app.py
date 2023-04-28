
import secrets
from flask import request, jsonify, session,  send_from_directory
from flask_restful import Resource
from models import User, Walk, Review, Follow
from config import app, api, db
import requests
import bcrypt
from werkzeug.utils import secure_filename
import os

UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.config["SECRET_KEY"] = secrets.token_hex(16)

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
        username = request.json.get('username')
        email = request.json.get('email')
        password = request.json.get('password')

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

class ReviewResource(Resource):
    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    def get(self, review_id=None):
        if review_id:
            review = Review.query.get(review_id)
            return review.to_dict() if review else {"error": "Review not found"}, 404
        else:
            reviews = Review.query.all()
            return [review.to_dict() for review in reviews]

    def post(self):
        rating = request.json.get('rating')
        text = request.json.get('text')
        user_id = request.json.get('user_id')
        walk_id = request.json.get('walk_id')

        if not rating or not text or not user_id or not walk_id:
            return {"error": "Rating, text, user_id, and walk_id are required fields"}, 400
        
        review = Review(rating=rating, text=text, user_id=user_id, walk_id=walk_id)

        if 'photo' in request.files:
            photo = request.files['photo']
            if photo and self.allowed_file(photo.filename):
                filename = secure_filename(photo.filename)
                photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                review.photo = filename

        db.session.add(review)
        db.session.commit()

        return {"message": "Review created successfully"}, 201
        db.session.add(review)
        db.session.commit()

    def put(self, review_id):
        review = Review.query.get(review_id)
        if not review:
            return {"error": "Review not found"}, 404

        if 'rating' in request.form:
            review.rating = request.form.get('rating')
        if 'text' in request.form:
            review.text = request.form.get('text')

        if 'photo' in request.files:
            photo = request.files['photo']
            if photo and self.allowed_file(photo.filename):
                filename = secure_filename(photo.filename)
                photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                review.photo = filename

        db.session.commit()

        return {"message": "Review updated successfully"}, 200

    def delete(self, review_id):
        review = Review.query.get(review_id)
        if not review:
            return {"error": "Review not found"}, 404

        db.session.delete(review)
        db.session.commit()

        return {"message": "Review deleted successfully"}, 200


api.add_resource(ReviewResource, '/reviews', '/reviews/<int:review_id>')

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

        return {"message": "Logged in successfully", "user": user.to_dict()}, 200
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

        return {"message": "User created successfully", "user": user.to_dict()}, 201
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

if __name__ == '__main__':
    app.run(port=5555, debug=True)

