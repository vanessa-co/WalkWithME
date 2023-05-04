"""changes to follow table

Revision ID: 9d2fd29448a8
Revises: 
Create Date: 2023-05-03 15:39:25.708858

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9d2fd29448a8'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=80), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password_hash', sa.String(length=255), nullable=False),
    sa.Column('profile_photo', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('follows',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('follower_id', sa.Integer(), nullable=False),
    sa.Column('followed_id', sa.Integer(), nullable=False),
    sa.Column('follower_username', sa.String(length=80), nullable=False),
    sa.Column('followed_username', sa.String(length=80), nullable=False),
    sa.ForeignKeyConstraint(['followed_id'], ['users.id'], name=op.f('fk_follows_followed_id_users')),
    sa.ForeignKeyConstraint(['follower_id'], ['users.id'], name=op.f('fk_follows_follower_id_users')),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('follower_id', 'followed_id', name='_follower_followed_uc')
    )
    op.create_table('walks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=False),
    sa.Column('location', sa.String(length=120), nullable=False),
    sa.Column('distance', sa.Float(), nullable=False),
    sa.Column('photo', sa.String(), nullable=True),
    sa.Column('description', sa.String(length=255), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_walks_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('reviews',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('text', sa.String(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('walk_id', sa.Integer(), nullable=False),
    sa.Column('rating', sa.Float(), nullable=False),
    sa.Column('comment', sa.String(length=255), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_reviews_user_id_users')),
    sa.ForeignKeyConstraint(['walk_id'], ['walks.id'], name=op.f('fk_reviews_walk_id_walks')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('reviews')
    op.drop_table('walks')
    op.drop_table('follows')
    op.drop_table('users')
    # ### end Alembic commands ###