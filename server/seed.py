
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

    vanessa = User(username='vanessa', email='vanessa@email.com', password_hash=vanessa_password, profile_photo='https://www.lombardvet.com/sites/default/files/styles/large/public/golden-retriever-dog-breed-info_0.jpg?itok=sYARdO3q')
    kim = User(username='kim', email='kim@email.com', password_hash=kim_password, profile_photo='https://static.wixstatic.com/media/237a38_78996c492b2741638f2a43b3a272159c~mv2.jpg/v1/fill/w_640,h_400,al_t,q_80,usm_0.66_1.00_0.01,enc_auto/237a38_78996c492b2741638f2a43b3a272159c~mv2.jpg')
    kevin = User(username='kevin', email='kevin@email.com', password_hash=kevin_password, profile_photo='https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-08/220805-border-collie-play-mn-1100-82d2f1.jpg')

    db.session.add_all([vanessa, kim, kevin])
    db.session.commit()

    


  # Faker user data
    fake = Faker()
    fake_users = []
    for i in range(10):
        username = fake.user_name()
        email = fake.email()
        password_hash = bcrypt.hashpw(fake.password().encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        profile_photo = fake.image_url()
        user = User(username=username, email=email, password_hash=password_hash, profile_photo=profile_photo)
        fake_users.append(user)

    db.session.add_all(fake_users)
    db.session.commit()

    users = User.query.all()

    # Walks for Vanessa
    vanessa_walk1 = Walk(name="Central Park Walk", location='Central Park', distance=2.5, photo='https://i.natgeofe.com/n/15ec8dec-df7c-45af-a0ae-08d4e906a134/belvedere-castle.jpg?w=2880&h=2160', user_id=vanessa.id)
    vanessa_walk2 = Walk(name="Hudson River Park Walk", location='Hudson River Park', distance=3.2, photo='https://www.frommers.com/system/media_items/attachments/000/868/444/s980/Frommers-New-York-City-jogging-hudson-park-1190x768.jpg?1646914426', user_id=vanessa.id)

    # Walks for Kim
    kim_walk1 = Walk(name="High Line Walk", location='High Line', distance=1.5, photo='https://assets.gocity.com/files/ufrfmb171/files/featured_images/shutterstock_247505947.jpg', user_id=kim.id)
    kim_walk2 = Walk(name="Brooklyn Bridge Park Walk", location='Brooklyn Bridge Park', distance=2.0, photo='https://wp.zillowstatic.com/streeteasy/2/GettyImages-668600109-a0cd92.jpg', user_id=kim.id)

    # Walks for Kevin
    kevin_walk1 = Walk(name="Battery Park Walk", location='Battery Park', distance=1.8, photo='https://www.nycgo.com/images/neighborhoods/27/battery-park-malcolm-brown-29__large.jpg', user_id=kevin.id)
    kevin_walk2 = Walk(name="Prospect Park Walk", location='Prospect Park', distance=2.8, photo='https://www.tripsavvy.com/thmb/DEzP48T8owV1q2yWmhezZc4u8aw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/autumnal-reflections-657130574-5a85a0b73de4230037ded41d.jpg', user_id=kevin.id)

    db.session.add_all([vanessa_walk1, vanessa_walk2, kim_walk1, kim_walk2, kevin_walk1, kevin_walk2])
    db.session.commit()

    # Reviews for Vanessa's walks
    vanessa_review1 = Review(id=1, text='I had the most Magical experience walking through Central Park!', user_id=vanessa.id, walk_id=vanessa_walk1.id, rating=5)
    vanessa_review2 = Review(id=2, text='Great place to people watch. There is also a running trail for all the runners out there!', user_id=vanessa.id, walk_id=vanessa_walk2.id, rating=4)

    # Reviews for Kim's walks
    kim_review1 = Review(id=3, text='The High Line is a unique park with beautiful views of the city!', user_id=kim.id, walk_id=kim_walk1.id, rating=5)
    kim_review2 = Review(id=4, text='Brooklyn Bridge Park has a great atmosphere and stunning views!', user_id=kim.id, walk_id=kim_walk2.id, rating=4)

    # Reviews for Kevin's walks
    kevin_review1 = Review(id=5, text='Battery Park has amazing views of the Statue of Liberty!', user_id=kevin.id, walk_id=kevin_walk1.id, rating=4)
    kevin_review2 = Review(id=6, text='Prospect Park is the perfect place to escape the hustle and bustle of the city!', user_id=kevin.id, walk_id=kevin_walk2.id, rating=5)


    db.session.add_all([vanessa_review1, vanessa_review2, kim_review1, kim_review2, kevin_review1, kevin_review2])
    db.session.commit()





    follows = []
    for i in range(30):
        follower = random.choice(users)
        followed = random.choice(users)
        # Ensure that follower and followed are not the same user
        while followed == follower:
            followed = random.choice(users)
        follow = Follow(follower_id=follower.id, follower_username=follower.username,
                    followed_id=followed.id, followed_username=followed.username)
        follows.append(follow)

    db.session.add_all(follows)
    db.session.commit()







if __name__ == '__main__':
    with app.app_context():
        seed_data()

