"""new models

Revision ID: 8cda3bf252cc
Revises: 5bb05377d15b
Create Date: 2023-05-07 12:27:29.473876

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8cda3bf252cc'
down_revision = '5bb05377d15b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('reviews', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=False))
        batch_op.add_column(sa.Column('walk_id', sa.Integer(), nullable=False))
        batch_op.add_column(sa.Column('comment', sa.String(length=255), nullable=True))
        batch_op.alter_column('category',
               existing_type=sa.VARCHAR(length=50),
               type_=sa.String(length=15),
               existing_nullable=False)
        batch_op.create_foreign_key(batch_op.f('fk_reviews_walk_id_walks'), 'walks', ['walk_id'], ['id'])
        batch_op.create_foreign_key(batch_op.f('fk_reviews_user_id_users'), 'users', ['user_id'], ['id'])
        batch_op.drop_column('username')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('reviews', schema=None) as batch_op:
        batch_op.add_column(sa.Column('username', sa.VARCHAR(length=100), nullable=False))
        batch_op.drop_constraint(batch_op.f('fk_reviews_user_id_users'), type_='foreignkey')
        batch_op.drop_constraint(batch_op.f('fk_reviews_walk_id_walks'), type_='foreignkey')
        batch_op.alter_column('category',
               existing_type=sa.String(length=15),
               type_=sa.VARCHAR(length=50),
               existing_nullable=False)
        batch_op.drop_column('comment')
        batch_op.drop_column('walk_id')
        batch_op.drop_column('user_id')

    # ### end Alembic commands ###
