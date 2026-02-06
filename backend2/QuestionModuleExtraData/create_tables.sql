-- Create question_templates table
CREATE TABLE IF NOT EXISTS question_templates (
    template_id SERIAL PRIMARY KEY,
    module VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    topic VARCHAR NOT NULL,
    subtopic VARCHAR NOT NULL,
    format VARCHAR NOT NULL,
    difficulty VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    dynamic_question TEXT NOT NULL,
    logical_answer TEXT NOT NULL,
    preview_data JSONB,
    preview_html TEXT,
    status VARCHAR NOT NULL DEFAULT 'draft',
    created_by_user_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for question_templates
CREATE INDEX IF NOT EXISTS idx_templates_module ON question_templates(module);
CREATE INDEX IF NOT EXISTS idx_templates_category ON question_templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_difficulty ON question_templates(difficulty);
CREATE INDEX IF NOT EXISTS idx_templates_status ON question_templates(status);
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON question_templates(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_templates_module_category_status ON question_templates(module, category, status);

-- Create question_generation_jobs table
CREATE TABLE IF NOT EXISTS question_generation_jobs (
    job_id SERIAL PRIMARY KEY,
    template_id INTEGER NOT NULL REFERENCES question_templates(template_id),
    requested_count INTEGER NOT NULL,
    generated_count INTEGER NOT NULL DEFAULT 0,
    generation_seed VARCHAR,
    generation_params JSONB,
    status VARCHAR NOT NULL DEFAULT 'pending',
    created_by_user_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Create indexes for question_generation_jobs
CREATE INDEX IF NOT EXISTS idx_jobs_template ON question_generation_jobs(template_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON question_generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON question_generation_jobs(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_template_status ON question_generation_jobs(template_id, status);

-- Create generated_questions table
CREATE TABLE IF NOT EXISTS generated_questions (
    generated_question_id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL REFERENCES question_generation_jobs(job_id),
    template_id INTEGER NOT NULL REFERENCES question_templates(template_id),
    question_html TEXT NOT NULL,
    answer_value VARCHAR NOT NULL,
    variables_used JSONB,
    difficulty_snapshot VARCHAR,
    hash_signature VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for generated_questions
CREATE INDEX IF NOT EXISTS idx_generated_template ON generated_questions(template_id);
CREATE INDEX IF NOT EXISTS idx_generated_job ON generated_questions(job_id);
CREATE INDEX IF NOT EXISTS idx_generated_hash ON generated_questions(hash_signature);

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('question_templates', 'question_generation_jobs', 'generated_questions');
