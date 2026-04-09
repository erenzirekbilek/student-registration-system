-- Enable PGVector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create schema for AI documents
CREATE SCHEMA IF NOT EXISTS ai_schema;

-- Create documents table for RAG
CREATE TABLE IF NOT EXISTS ai_schema.regulations (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(384),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_regulations_embedding 
ON ai_schema.regulations 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Grant permissions
GRANT ALL ON ai_schema.regulations TO postgres;
GRANT USAGE ON SCHEMA ai_schema TO postgres;
