/*
  # Create chat conversations table

  1. New Tables
    - `chat_conversations`
      - `id` (uuid, primary key) - Unique identifier for each conversation
      - `session_id` (text) - Browser session identifier for grouping messages
      - `message` (text) - The user's message or bot's response
      - `role` (text) - Either 'user' or 'assistant'
      - `created_at` (timestamptz) - Timestamp of when message was created

  2. Security
    - Enable RLS on `chat_conversations` table
    - Add policy for public read access (portfolio is public)
    - Add policy for public insert access (anyone can chat)

  3. Indexes
    - Add index on session_id for efficient conversation retrieval
    - Add index on created_at for chronological ordering
*/

CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  message text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read chat conversations"
  ON chat_conversations
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert chat messages"
  ON chat_conversations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_chat_session_id ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat_conversations(created_at);