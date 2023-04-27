

from datetime import datetime
from app import app, db, bcrypt
from models import User, Walk, Review, Follow

def seed_data():

    db.drop_all()
    db.create_all()

    # Create some users
    vanessa = User(username='vanessa', email='vanessa@email.com', password='password1')
    kim = User(username='kim', email='kim@email.com', password='password2')
    kevin = User(username='kevin', email='kevin@email.com', password='password3')

    db.session.add_all([vanessa, kim, kevin])
    db.session.commit()

    # walks for vanessa
    vanessa_walk1 = Walk(name='Central Park', distance=2.5, photo='https://i.natgeofe.com/n/15ec8dec-df7c-45af-a0ae-08d4e906a134/belvedere-castle.jpg?w=2880&h=2160', user_id=vanessa.id, )
    vanessa_walk2 = Walk(name='Hudson River Park', distance=3.2, photo='https://www.frommers.com/system/media_items/attachments/000/868/444/s980/Frommers-New-York-City-jogging-hudson-park-1190x768.jpg?1646914426', user_id=vanessa.id,)

    db.session.add_all([vanessa_walk1, vanessa_walk2])
    db.session.commit()

    # reviews for Vanessa's walks
    vanessa_review1 = Review(text='Great walk!', user_id=vanessa.id, walk_id=vanessa_walk1.id, rating=5, )
    vanessa_review2 = Review(text='Beautiful views!', user_id=vanessa.id, walk_id=vanessa_walk2.id, rating=4,)

    db.session.add_all([vanessa_review1, vanessa_review2])
    db.session.commit()

    # Have kim follow vanessa
    kim_follow_vanessa = Follow(follower_id=kim.id, followed_id=vanessa.id,)
    db.session.add(kim_follow_vanessa)
    db.session.commit()


if __name__ == '__main__':
    with app.app_context():
        seed_data()
