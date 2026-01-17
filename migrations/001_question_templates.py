"""Add question template tables

Revision ID: 001_question_templates
Revises: 
Create Date: 2026-01-18

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_question_templates'
down_revision = None
depends_on = None


def upgrade():
    # Create question_templates table
    op.create_table(
        'question_templates',
        sa.Column('template_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('module', sa.String(), nullable=False),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('topic', sa.String(), nullable=False),
        sa.Column('subtopic', sa.String(), nullable=False),
        sa.Column('format', sa.String(), nullable=False),
        sa.Column('difficulty', sa.String(), nullable=False),
        sa.Column('type', sa.String(), nullable=False),
        sa.Column('dynamic_question', sa.Text(), nullable=False),
        sa.Column('logical_answer', sa.Text(), nullable=False),
        sa.Column('preview_data', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('preview_html', sa.Text(), nullable=True),
        sa.Column('status', sa.String(), nullable=False, server_default='draft'),
        sa.Column('created_by_user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('template_id')
    )
    
    # Create indexes for question_templates
    op.create_index('idx_templates_module', 'question_templates', ['module'])
    op.create_index('idx_templates_category', 'question_templates', ['category'])
    op.create_index('idx_templates_difficulty', 'question_templates', ['difficulty'])
    op.create_index('idx_templates_status', 'question_templates', ['status'])
    op.create_index('idx_templates_created_by', 'question_templates', ['created_by_user_id'])
    op.create_index('idx_templates_module_category_status', 'question_templates', ['module', 'category', 'status'])
    
    # Create question_generation_jobs table
    op.create_table(
        'question_generation_jobs',
        sa.Column('job_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('template_id', sa.Integer(), nullable=False),
        sa.Column('requested_count', sa.Integer(), nullable=False),
        sa.Column('generated_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('generation_seed', sa.String(), nullable=True),
        sa.Column('generation_params', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('status', sa.String(), nullable=False, server_default='pending'),
        sa.Column('created_by_user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['template_id'], ['question_templates.template_id'], ),
        sa.PrimaryKeyConstraint('job_id')
    )
    
    # Create indexes for question_generation_jobs
    op.create_index('idx_jobs_template', 'question_generation_jobs', ['template_id'])
    op.create_index('idx_jobs_status', 'question_generation_jobs', ['status'])
    op.create_index('idx_jobs_created_by', 'question_generation_jobs', ['created_by_user_id'])
    op.create_index('idx_jobs_template_status', 'question_generation_jobs', ['template_id', 'status'])
    
    # Create generated_questions table
    op.create_table(
        'generated_questions',
        sa.Column('generated_question_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('job_id', sa.Integer(), nullable=False),
        sa.Column('template_id', sa.Integer(), nullable=False),
        sa.Column('question_html', sa.Text(), nullable=False),
        sa.Column('answer_value', sa.String(), nullable=False),
        sa.Column('variables_used', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('difficulty_snapshot', sa.String(), nullable=True),
        sa.Column('hash_signature', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['job_id'], ['question_generation_jobs.job_id'], ),
        sa.ForeignKeyConstraint(['template_id'], ['question_templates.template_id'], ),
        sa.PrimaryKeyConstraint('generated_question_id')
    )
    
    # Create indexes for generated_questions
    op.create_index('idx_generated_template', 'generated_questions', ['template_id'])
    op.create_index('idx_generated_job', 'generated_questions', ['job_id'])
    op.create_index('idx_generated_hash', 'generated_questions', ['hash_signature'])


def downgrade():
    # Drop tables in reverse order
    op.drop_table('generated_questions')
    op.drop_table('question_generation_jobs')
    op.drop_table('question_templates')
