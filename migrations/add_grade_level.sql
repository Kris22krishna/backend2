-- Migration: Add grade_level to question_templates
-- Date: 2026-01-18
-- Description: Adds grade_level column for student grade assignment (1-12)

-- Add the column (nullable first for existing data)
ALTER TABLE question_templates 
ADD COLUMN grade_level INTEGER;

-- Update existing records to default grade 1
UPDATE question_templates 
SET grade_level = 1 
WHERE grade_level IS NULL;

-- Make it NOT NULL and add index
ALTER TABLE question_templates 
ALTER COLUMN grade_level SET NOT NULL;

CREATE INDEX idx_question_templates_grade_level 
ON question_templates(grade_level);

-- Verify
SELECT template_id, grade_level, topic, status 
FROM question_templates 
LIMIT 5;
