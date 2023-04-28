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
    john = User(username='john', email='john@email.com', password='password4')
    emma = User(username='emma', email='emma@email.com', password='password5')

    db.session.add_all([vanessa, kim, kevin, john, emma])
    db.session.commit()

    # Walks for Vanessa
    vanessa_walk1 = Walk(location='Central Park', distance=2.5, photo='https://i.natgeofe.com/n/15ec8dec-df7c-45af-a0ae-08d4e906a134/belvedere-castle.jpg?w=2880&h=2160', user_id=vanessa.username)
    vanessa_walk2 = Walk(location='Hudson River Park', distance=3.2, photo='https://www.frommers.com/system/media_items/attachments/000/868/444/s980/Frommers-New-York-City-jogging-hudson-park-1190x768.jpg?1646914426', user_id=vanessa.username)

    # Walks for Kim
    kim_walk1 = Walk(location='High Line', distance=1.5, photo='https://assets.gocity.com/files/ufrfmb171/files/featured_images/shutterstock_247505947.jpg', user_id=kim.username)
    kim_walk2 = Walk(location='Brooklyn Bridge Park', distance=2.0, photo='https://wp.zillowstatic.com/streeteasy/2/GettyImages-668600109-a0cd92.jpg', user_id=kim.username)

    # Walks for Kevin
    kevin_walk1 = Walk(location='Battery Park', distance=1.8, photo='https://www.nycgo.com/images/neighborhoods/27/battery-park-malcolm-brown-29__large.jpg', user_id=kevin.username)
    kevin_walk2 = Walk(location='Prospect Park', distance=2.8, photo='https://www.tripsavvy.com/thmb/DEzP48T8owV1q2yWmhezZc4u8aw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/autumnal-reflections-657130574-5a85a0b73de4230037ded41d.jpg', user_id=kevin.username)

    db.session.add_all([vanessa_walk1, vanessa_walk2, kim_walk1, kim_walk2, kevin_walk1, kevin_walk2])
    db.session.commit()

    # Reviews for Vanessa's walks
    vanessa_review1 = Review(text='I had the most Magical experiance walking through Central Park!', user_id=vanessa.id, walk_id=vanessa_walk1.id, rating=5)
    vanessa_review2 = Review(text='Great place to people watch. There is also a running trail for all the runners out there!', user_id=vanessa.id, walk_id=vanessa_walk2.id, rating=4)

    # Reviews for Kim's walks
    kim_review1 = Review(text='The High Line is a unique park with beautiful views of the city!', user_id=kim.id, walk_id=kim_walk1.id, rating=5)

    db.session.add_all([vanessa_review1, vanessa_review2, kim_review1])
    db.session.commit()

    # Have kim follow vanessa
    kim_follow_vanessa = Follow(follower_id=kim.id, followed_id=vanessa.id)
    db.session.add(kim_follow_vanessa)
    db.session.commit()

  

if __name__ == '__main__':
    with app.app_context():
        seed_data()

