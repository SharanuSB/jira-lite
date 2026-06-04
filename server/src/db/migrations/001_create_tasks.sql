-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(255)  NOT NULL,
  description TEXT,
  status      VARCHAR(50)   NOT NULL DEFAULT 'todo',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  CONSTRAINT tasks_status_check
    CHECK (status IN ('todo', 'in_progress', 'done'))
);

CREATE INDEX IF NOT EXISTS idx_tasks_status
  ON tasks(status);

CREATE INDEX IF NOT EXISTS idx_tasks_created_at
  ON tasks(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tasks_title_search
  ON tasks USING gin(to_tsvector('english', title));


-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();