import secrets
from flask import request, jsonify, session, send_from_directory
from flask_restful import Resource
from models import User, Walk, Review, Follow
from config import app, api, db
import bcrypt
from werkzeug.utils import secure_filename
import os
from flask_login import LoginManager, login_user, logout_user, login_required, current_user

app.config["SECRET_KEY"] = secrets.token_hex(16)

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



reviews = []

class ReviewResource(Resource):
    def get(self):
        return reviews

    def post(self):
        review = request.json
        review['id'] = len(reviews) + 1
        reviews.append(review)
        return review, 201

class ReviewByIdResource(Resource):
    def find_review(self, review_id):
        return next((r for r in reviews if r['id'] == review_id), None)

    def patch(self, review_id):
        review = self.find_review(review_id)
        if review:
            updated_data = request.json
            review.update(updated_data)
            return review
        return {'error': 'Review not found'}, 404

    def delete(self, review_id):
        global reviews
        reviews = [r for r in reviews if r['id'] != review_id]
        return {'result': 'Review deleted'}

api.add_resource(ReviewResource, '/reviews')
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



