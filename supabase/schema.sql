-- ==============================================================================
-- KrishiMitra AI - Supabase PostgreSQL Database Schema & RLS Policies
-- Execute this script in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. Enable pgcrypto / uuid extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Chat Sessions Table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    context JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    structured_data JSONB DEFAULT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for chat_sessions
-- Allow users to manage their own sessions when authenticated
DROP POLICY IF EXISTS "Users can manage own sessions" ON public.chat_sessions;
CREATE POLICY "Users can manage own sessions"
    ON public.chat_sessions
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow anonymous access to unassigned sessions (where user_id IS NULL)
DROP POLICY IF EXISTS "Anonymous session access" ON public.chat_sessions;
CREATE POLICY "Anonymous session access"
    ON public.chat_sessions
    FOR ALL
    TO anon
    USING (user_id IS NULL)
    WITH CHECK (user_id IS NULL);

-- 7. RLS Policies for chat_messages
-- Messages accessible only if user has access to parent session
DROP POLICY IF EXISTS "Users can access messages for own sessions" ON public.chat_messages;
CREATE POLICY "Users can access messages for own sessions"
    ON public.chat_messages
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_sessions
            WHERE public.chat_sessions.id = public.chat_messages.session_id
            AND (public.chat_sessions.user_id = auth.uid() OR public.chat_sessions.user_id IS NULL)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chat_sessions
            WHERE public.chat_sessions.id = public.chat_messages.session_id
            AND (public.chat_sessions.user_id = auth.uid() OR public.chat_sessions.user_id IS NULL)
        )
    );

DROP POLICY IF EXISTS "Anon can access unassigned session messages" ON public.chat_messages;
CREATE POLICY "Anon can access unassigned session messages"
    ON public.chat_messages
    FOR ALL
    TO anon
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_sessions
            WHERE public.chat_sessions.id = public.chat_messages.session_id
            AND public.chat_sessions.user_id IS NULL
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chat_sessions
            WHERE public.chat_sessions.id = public.chat_messages.session_id
            AND public.chat_sessions.user_id IS NULL
        )
    );

-- 8. Trigger to automatically update updated_at on chat_sessions
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_chat_sessions_updated_at ON public.chat_sessions;
CREATE TRIGGER trigger_chat_sessions_updated_at
    BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
