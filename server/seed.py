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
    vanessa_walk1 = Walk(name="Wine Walk", location='Central Park', distance=2.5, photo='https://www.splashway.com/wp-content/uploads/2022/03/BLOG.jpg', user_id=vanessa.id)
    vanessa_walk2 = Walk(name="Mud Run", location='Hudson River Park', distance=5.0, photo='https://www.active.com/Assets/Running/460/10-tips-mud-run-460.jpg', user_id=vanessa.id)

    # Walks for Kim
    kim_walk1 = Walk(name="Flower Power", location='Brooklyn Botanical Gardens', distance=2.5, photo='https://yourbrooklynguide.com/wp-content/uploads/2020/08/Rose-Garden-at-Brooklyn-Botanic-Garden.jpg', user_id=kim.id)
    kim_walk2 = Walk(name="Tunnel Run", location='West New York', distance=3.0, photo='https://www.sonj.org/wp-content/uploads/2022/05/ltc-photo-8.jpg', user_id=kim.id)

    # Walks for Kevin
    kevin_walk1 = Walk(name="Zombie Walk", location='Battery Park', distance=1.8, photo='https://www.thestate.com/entertainment/local-events/sc7bil/picture180691751/alternates/LANDSCAPE_1140/zombiewalk3', user_id=kevin.id)
    kevin_walk2 = Walk(name="Iron Man", location='Prospect Park', distance=2.8, photo='https://www.drjimtaylor.com/4.0/wp-content/uploads/2020/12/IM-1.jpg', user_id=kevin.id)

    db.session.add_all([vanessa_walk1, vanessa_walk2, kim_walk1, kim_walk2, kevin_walk1, kevin_walk2])
    db.session.commit()


    # Reviews for Vanessa's walks
    vanessa_review1 = Review(id=1, text='The wine walk was a delightful experience, allowing me to sample a variety of wines while enjoying a leisurely stroll through the park. The picturesque scenery and knowledgeable guides made for a truly enjoyable outing.', 
                             user_id=vanessa.id, walk_id=vanessa_walk1.id, rating=5, event_name='Wine Walk', location='Central Park, NY', date='2023-05-01', time='15:00', category='leisure')
    vanessa_review2 = Review(id=2, text='The mud run was an exhilarating and challenging adventure that pushed me to my limits. The camaraderie and sense of achievement among fellow participants made it a truly unforgettable experience!', 
                             user_id=vanessa.id, walk_id=vanessa_walk2.id, rating=4, event_name='Mud Run', location='Hudson River Park, NY', date='2023-05-02', time='14:00', category='athletic')
# Reviews for Kim's walks
    kim_review1 = Review(id=3, text='The Brooklyn Botanical Gardens walk was a tranquil and scenic escape from the hustle and bustle of city life, filled with vibrant colors and fragrant blooms that invigorated the senses. The knowledgeable guides provided insightful commentary that deepened my appreciation for the natural beauty of the gardens.',
                          user_id=kim.id, walk_id=kim_walk1.id, rating=5, event_name='Brooklyn Botanical Gardens', location='Brooklyn, NY', date='2023-05-03', time='11:00', category='leisure')
    kim_review2 = Review(id=4, text='The Tunnel Run for the Special Olympics was an inspiring event that brought together individuals of all abilities to support a great cause. The sense of community and inclusion, combined with the challenging tunnel course, made it a truly memorable experience for everyone involved.', 
                         user_id=kim.id, walk_id=kim_walk2.id, rating=4, event_name='Tunnel Run', location='West New York, NJ', date='2023-05-04', time='16:00', category='Charity')

# Reviews for Kevin's walks
    kevin_review1 = Review(id=5, text='The zombie walk had a fun, campy atmosphere and the costumes were impressive. However, the walk was disorganized and lacked a clear route, which made the experience less enjoyable than it could have been.', 
                           user_id=kevin.id,walk_id=kevin_walk1.id, rating=3, event_name='Zombie Walk', location='Battery Park, NY', date='2023-05-05', time='09:00', category='leisure')
    kevin_review2 = Review(id=6, text='The Iron Man run was an intense and grueling event that pushed athletes to their limits both physically and mentally. The impressive feats of strength and endurance on display were awe-inspiring, making it a thrilling and unforgettable experience for both participants and spectators.', 
                           user_id=kevin.id, walk_id=kevin_walk2.id,rating=5, event_name='Iron Man', location='Prospect Park, NY', date='2023-05-06', time='9:00', category='Athletic')




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
