
from datetime import datetime
from app import app, db
from models import User, Walk, Review, Follow
import bcrypt
import random
from faker import Faker

def seed_data():
    fake = Faker()

    db.drop_all()
    db.create_all()

    vanessa_password = bcrypt.hashpw('password1'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    kim_password = bcrypt.hashpw('password2'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    kevin_password = bcrypt.hashpw('password3'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    vanessa = User(username='vanessa', email='vanessa@email.com', password_hash=vanessa_password, profile_photo=None)
    kim = User(username='kim', email='kim@email.com', password_hash=kim_password, profile_photo='')
    kevin = User(username='kevin', email='kevin@email.com', password_hash=kevin_password, profile_photo='')

    db.session.add_all([vanessa, kim, kevin])
    db.session.commit()

    


  # Faker user data
    fake = Faker()
    fake_users = []
    for i in range(10):
        username = fake.user_name()
        email = fake.email()
        password_hash = bcrypt.hashpw(fake.password().encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        profile_photo = None
        user = User(username=username, email=email, password_hash=password_hash, profile_photo=profile_photo)
        fake_users.append(user)

    db.session.add_all(fake_users)
    db.session.commit()

    users = User.query.all()

    # Walks for Vanessa
    vanessa_walk1 = Walk(name="Wine Walk", location='Central Park', distance=2.5, photo='https://i.natgeofe.com/n/15ec8dec-df7c-45af-a0ae-08d4e906a134/belvedere-castle.jpg?w=2880&h=2160', user_id=vanessa.id)
    vanessa_walk2 = Walk(name="Mud Run", location='Hudson River Park', distance=3.2, photo='https://www.frommers.com/system/media_items/attachments/000/868/444/s980/Frommers-New-York-City-jogging-hudson-park-1190x768.jpg?1646914426', user_id=vanessa.id)

    # Walks for Kim
    kim_walk1 = Walk(name="High Line Walk", location='High Line', distance=1.5, photo='https://assets.gocity.com/files/ufrfmb171/files/featured_images/shutterstock_247505947.jpg', user_id=kim.id)
    kim_walk2 = Walk(name="Brooklyn Bridge Park Walk", location='Brooklyn Bridge Park', distance=2.0, photo='https://wp.zillowstatic.com/streeteasy/2/GettyImages-668600109-a0cd92.jpg', user_id=kim.id)

    # Walks for Kevin
    kevin_walk1 = Walk(name="Battery Park Walk", location='Battery Park', distance=1.8, photo='https://www.nycgo.com/images/neighborhoods/27/battery-park-malcolm-brown-29__large.jpg', user_id=kevin.id)
    kevin_walk2 = Walk(name="Prospect Park Walk", location='Prospect Park', distance=2.8, photo='https://www.tripsavvy.com/thmb/DEzP48T8owV1q2yWmhezZc4u8aw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/autumnal-reflections-657130574-5a85a0b73de4230037ded41d.jpg', user_id=kevin.id)

    db.session.add_all([vanessa_walk1, vanessa_walk2, kim_walk1, kim_walk2, kevin_walk1, kevin_walk2])
    db.session.commit()


    # Reviews for Vanessa's walks
    vanessa_review1 = Review(id=1, text='We had such a blast on our winee walk, a great time for groups of friends or couples!', user_id=vanessa.id, walk_id=vanessa_walk1.id, rating=5, event_name='Wine Walk', location='Central Park, NY', date='2023-05-01', time='15:00', category='leisure')
    vanessa_review2 = Review(id=2, text='Sign up for a mud run as soon as you can!', user_id=vanessa.id, walk_id=vanessa_walk2.id, rating=4, event_name='Mud Run', location='Hudson River Park, NY', date='2023-05-02', time='14:00', category='athletic')
# Reviews for Kim's walks
    kim_review1 = Review(id=3, text='This nature walk was exactky what i needed!', user_id=kim.id, walk_id=kim_walk1.id, rating=5, event_name='Brooklyn Botanical Gardens', location='Brooklyn, NY', date='2023-05-03', time='11:00', category='leisure')
    kim_review2 = Review(id=4, text='the Tunnle run is for such a good cause. we look forward to it every year!', user_id=kim.id, walk_id=kim_walk2.id, rating=4, event_name='Tunnel Run', location='West Newyork, NJ', date='2023-05-04', time='16:00', category='Charity')

# Reviews for Kevin's walks
    kevin_review1 = Review(id=5, text='The zombie walk was a killer good time', user_id=kevin.id,walk_id=kevin_walk1.id, rating=4, event_name='Zombie Walk', location='Battery Park, NY', date='2023-05-05', time='09:00', category='leisure')
    kevin_review2 = Review(id=6, text='the Iron man Run was the a thrill!', user_id=kevin.id, walk_id=kevin_walk2.id,rating=5, event_name='Iron Man', location='Prospect Park, NY', date='2023-05-06', time='9:00', category='Athletic')




    db.session.add_all([vanessa_review1, vanessa_review2, kim_review1, kim_review2, kevin_review1, kevin_review2])
    db.session.commit()





    follows = []
    unique_follows = set()

    for i in range(100):
        while True:
            follower = random.choice(users)
            followed = random.choice(users)

            # Ensure that follower and followed are not the same user
            if followed == follower:
                continue

            # Check if the pair is unique
            follow_pair = (follower.id, followed.id)
            if follow_pair not in unique_follows:
                unique_follows.add(follow_pair)
                break

        follow = Follow(follower_id=follower.id, follower_username=follower.username,
                        followed_id=followed.id, followed_username=followed.username)
        follows.append(follow)

    db.session.add_all(follows)
    db.session.commit()



if __name__ == '__main__':
    with app.app_context():
        seed_data()

