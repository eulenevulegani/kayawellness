-- =====================================================
-- KAYA Wellness App - Complete Supabase SQL Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE (extends Supabase auth.users)
-- =====================================================
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    
    -- Wellness Goals & Preferences
    goals TEXT[] DEFAULT '{}',
    session_length VARCHAR(50) DEFAULT 'medium',
    check_in_times TEXT[] DEFAULT '{}',
    lifestyle VARCHAR(50) DEFAULT 'balanced',
    support_preferences TEXT[] DEFAULT '{}',
    experience_level VARCHAR(50) DEFAULT 'beginner',
    
    -- Program Progress
    active_program_id VARCHAR(100),
    program_progress INTEGER DEFAULT 0,
    completed_programs TEXT[] DEFAULT '{}',
    
    -- Gamification
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    last_session_date TIMESTAMP,
    
    -- Subscription
    subscription_tier VARCHAR(50) DEFAULT 'free',
    subscription_expires_at TIMESTAMP,
    
    -- Notification Preferences
    notifications_enabled BOOLEAN DEFAULT true,
    check_in_reminders BOOLEAN DEFAULT true,
    streak_protection BOOLEAN DEFAULT true,
    milestone_alerts BOOLEAN DEFAULT true,
    challenge_updates BOOLEAN DEFAULT true,
    therapist_qa BOOLEAN DEFAULT true,
    calendar_sync BOOLEAN DEFAULT false,
    quiet_hours_start TIME DEFAULT '22:00',
    quiet_hours_end TIME DEFAULT '07:00',
    
    -- Community
    joined_challenges TEXT[] DEFAULT '{}',
    support_groups TEXT[] DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- SESSIONS TABLE
-- =====================================================
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Session Details
    date TIMESTAMP DEFAULT NOW(),
    mood VARCHAR(100) NOT NULL,
    reflection TEXT,
    session_type VARCHAR(100) DEFAULT 'personalized',
    
    -- Session Data
    duration_minutes INTEGER,
    steps_completed JSONB,
    affirmation TEXT,
    
    -- Program Context
    program_id VARCHAR(100),
    program_day INTEGER,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_date ON public.sessions(date DESC);
CREATE INDEX idx_sessions_program ON public.sessions(program_id);

-- =====================================================
-- ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Achievement Details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50),
    category VARCHAR(100),
    
    -- Achievement Data
    date TIMESTAMP DEFAULT NOW(),
    xp_awarded INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX idx_achievements_date ON public.achievements(date DESC);

-- =====================================================
-- GRATITUDE ENTRIES TABLE
-- =====================================================
CREATE TABLE public.gratitude_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Gratitude Content
    word VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT NOW(),
    
    -- Privacy
    is_public BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_gratitude_user_id ON public.gratitude_entries(user_id);
CREATE INDEX idx_gratitude_date ON public.gratitude_entries(date DESC);
CREATE INDEX idx_gratitude_public ON public.gratitude_entries(is_public, date DESC);

-- =====================================================
-- JOURNAL ENTRIES TABLE
-- =====================================================
CREATE TABLE public.journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Journal Content
    title VARCHAR(500),
    content TEXT NOT NULL,
    mood VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    
    -- AI Insights
    ai_prompts_used TEXT[] DEFAULT '{}',
    ai_insight TEXT,
    
    -- Metadata
    date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_journal_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_date ON public.journal_entries(date DESC);

-- =====================================================
-- PROGRAMS TABLE (Reference Data)
-- =====================================================
CREATE TABLE public.programs (
    id VARCHAR(100) PRIMARY KEY,
    
    -- Program Details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration INTEGER NOT NULL,
    category VARCHAR(100),
    difficulty VARCHAR(50),
    
    -- Program Content
    daily_themes TEXT[] NOT NULL,
    objectives TEXT[] DEFAULT '{}',
    
    -- Access Control
    requires_premium BOOLEAN DEFAULT false,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- USER PROGRAM PROGRESS TABLE
-- =====================================================
CREATE TABLE public.user_program_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    program_id VARCHAR(100) NOT NULL REFERENCES public.programs(id),
    
    -- Progress Tracking
    current_day INTEGER DEFAULT 1,
    completed_days INTEGER[] DEFAULT '{}',
    is_completed BOOLEAN DEFAULT false,
    completion_date TIMESTAMP,
    
    -- Timestamps
    started_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, program_id)
);

CREATE INDEX idx_user_program_user_id ON public.user_program_progress(user_id);
CREATE INDEX idx_user_program_active ON public.user_program_progress(user_id, is_completed);

-- =====================================================
-- CHALLENGES TABLE
-- =====================================================
CREATE TABLE public.challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Challenge Details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    
    -- Challenge Rules
    duration_days INTEGER NOT NULL,
    goal_description TEXT NOT NULL,
    target_sessions INTEGER,
    target_streak INTEGER,
    
    -- Rewards
    xp_reward INTEGER DEFAULT 0,
    badge_icon VARCHAR(50),
    
    -- Timing
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_challenges_active ON public.challenges(is_active, start_date, end_date);

-- =====================================================
-- USER CHALLENGES TABLE
-- =====================================================
CREATE TABLE public.user_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    
    -- Progress
    progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    completion_date TIMESTAMP,
    
    -- Timestamps
    joined_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, challenge_id)
);

CREATE INDEX idx_user_challenges_user_id ON public.user_challenges(user_id);
CREATE INDEX idx_user_challenges_active ON public.user_challenges(user_id, is_completed);

-- =====================================================
-- SUPPORT GROUPS TABLE
-- =====================================================
CREATE TABLE public.support_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Group Details
    name VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Settings
    is_anonymous BOOLEAN DEFAULT true,
    max_members INTEGER,
    member_count INTEGER DEFAULT 0,
    
    -- Moderation
    is_moderated BOOLEAN DEFAULT true,
    guidelines TEXT,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_support_groups_active ON public.support_groups(is_active);

-- =====================================================
-- USER SUPPORT GROUPS TABLE
-- =====================================================
CREATE TABLE public.user_support_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
    
    -- Membership
    joined_at TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP DEFAULT NOW(),
    
    -- Privacy
    display_name VARCHAR(255),
    is_anonymous BOOLEAN DEFAULT true,
    
    UNIQUE(user_id, group_id)
);

CREATE INDEX idx_user_support_groups_user_id ON public.user_support_groups(user_id);
CREATE INDEX idx_user_support_groups_group_id ON public.user_support_groups(group_id);

-- =====================================================
-- THERAPISTS TABLE
-- =====================================================
CREATE TABLE public.therapists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Therapist Details
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    credentials TEXT[] DEFAULT '{}',
    specializations TEXT[] DEFAULT '{}',
    
    -- Practice Information
    languages TEXT[] DEFAULT '{}',
    therapy_approaches TEXT[] DEFAULT '{}',
    experience_years INTEGER,
    
    -- Availability
    is_accepting_clients BOOLEAN DEFAULT true,
    session_types TEXT[] DEFAULT '{}',
    
    -- Contact
    bio TEXT,
    profile_image_url TEXT,
    
    -- Metadata
    rating DECIMAL(3,2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_therapists_active ON public.therapists(is_accepting_clients);
CREATE INDEX idx_therapists_specializations ON public.therapists USING GIN(specializations);

-- =====================================================
-- WELLNESS EVENTS TABLE
-- =====================================================
CREATE TABLE public.wellness_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Event Details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    event_type VARCHAR(100),
    
    -- Timing
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Virtual Event Info
    is_virtual BOOLEAN DEFAULT true,
    meeting_url TEXT,
    
    -- Capacity
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    
    -- Access
    requires_premium BOOLEAN DEFAULT false,
    
    -- Metadata
    host_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_active ON public.wellness_events(is_active, start_time);
CREATE INDEX idx_events_category ON public.wellness_events(category);

-- =====================================================
-- USER EVENT REGISTRATIONS TABLE
-- =====================================================
CREATE TABLE public.user_event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.wellness_events(id) ON DELETE CASCADE,
    
    -- Registration Details
    registered_at TIMESTAMP DEFAULT NOW(),
    attended BOOLEAN DEFAULT false,
    attended_at TIMESTAMP,
    
    UNIQUE(user_id, event_id)
);

CREATE INDEX idx_user_events_user_id ON public.user_event_registrations(user_id);
CREATE INDEX idx_user_events_event_id ON public.user_event_registrations(event_id);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Notification Content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(100) NOT NULL,
    
    -- Action
    action_url TEXT,
    action_label VARCHAR(100),
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id, is_read, created_at DESC);

-- =====================================================
-- XP TRANSACTIONS TABLE (for audit trail)
-- =====================================================
CREATE TABLE public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Transaction Details
    amount INTEGER NOT NULL,
    source VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Context
    session_id UUID REFERENCES public.sessions(id),
    achievement_id UUID REFERENCES public.achievements(id),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_xp_transactions_user_id ON public.xp_transactions(user_id, created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gratitude_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_program_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_support_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Sessions Policies
CREATE POLICY "Users can view own sessions" ON public.sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON public.sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Achievements Policies
CREATE POLICY "Users can view own achievements" ON public.achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own achievements" ON public.achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Gratitude Entries Policies
CREATE POLICY "Users can view own gratitude" ON public.gratitude_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public gratitude" ON public.gratitude_entries
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create own gratitude" ON public.gratitude_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gratitude" ON public.gratitude_entries
    FOR UPDATE USING (auth.uid() = user_id);

-- Journal Entries Policies
CREATE POLICY "Users can view own journal" ON public.journal_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own journal" ON public.journal_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal" ON public.journal_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal" ON public.journal_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Program Progress Policies
CREATE POLICY "Users can view own program progress" ON public.user_program_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own program progress" ON public.user_program_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own program progress" ON public.user_program_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Challenges Policies
CREATE POLICY "Users can view own challenges" ON public.user_challenges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can join challenges" ON public.user_challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges" ON public.user_challenges
    FOR UPDATE USING (auth.uid() = user_id);

-- Support Groups Policies
CREATE POLICY "Users can view own groups" ON public.user_support_groups
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can join groups" ON public.user_support_groups
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Event Registrations Policies
CREATE POLICY "Users can view own registrations" ON public.user_event_registrations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own registrations" ON public.user_event_registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- XP Transactions Policies
CREATE POLICY "Users can view own XP transactions" ON public.xp_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Public Read Policies for Reference Tables
CREATE POLICY "Anyone can view programs" ON public.programs
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view challenges" ON public.challenges
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view support groups" ON public.support_groups
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view therapists" ON public.therapists
    FOR SELECT USING (is_accepting_clients = true);

CREATE POLICY "Anyone can view events" ON public.wellness_events
    FOR SELECT USING (is_active = true);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON public.journal_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_program_progress_updated_at BEFORE UPDATE ON public.user_program_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_challenges_updated_at BEFORE UPDATE ON public.user_challenges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate user level from XP
CREATE OR REPLACE FUNCTION calculate_level(xp_amount INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN FLOOR(SQRT(xp_amount / 100)) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update user level when XP changes
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
    NEW.level = calculate_level(NEW.xp);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_level_on_xp_change BEFORE UPDATE OF xp ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_user_level();

-- Function to create XP transaction and update user XP
CREATE OR REPLACE FUNCTION add_xp_to_user(
    p_user_id UUID,
    p_amount INTEGER,
    p_source VARCHAR(100),
    p_description TEXT DEFAULT NULL,
    p_session_id UUID DEFAULT NULL,
    p_achievement_id UUID DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    -- Insert transaction record
    INSERT INTO public.xp_transactions (user_id, amount, source, description, session_id, achievement_id)
    VALUES (p_user_id, p_amount, p_source, p_description, p_session_id, p_achievement_id);
    
    -- Update user XP
    UPDATE public.user_profiles
    SET xp = xp + p_amount
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS void AS $$
DECLARE
    v_user RECORD;
    v_yesterday DATE;
BEGIN
    v_yesterday := CURRENT_DATE - INTERVAL '1 day';
    
    FOR v_user IN SELECT id, last_session_date, streak FROM public.user_profiles LOOP
        IF v_user.last_session_date IS NULL THEN
            -- First session ever
            UPDATE public.user_profiles SET streak = 1, last_session_date = NOW() WHERE id = v_user.id;
        ELSIF DATE(v_user.last_session_date) = CURRENT_DATE THEN
            -- Already did session today, no change
            CONTINUE;
        ELSIF DATE(v_user.last_session_date) = v_yesterday THEN
            -- Continuing streak
            UPDATE public.user_profiles SET streak = v_user.streak + 1, last_session_date = NOW() WHERE id = v_user.id;
        ELSE
            -- Streak broken, reset to 1
            UPDATE public.user_profiles SET streak = 1, last_session_date = NOW() WHERE id = v_user.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SEED DATA - Initial Programs
-- =====================================================
INSERT INTO public.programs (id, title, description, duration, category, difficulty, daily_themes, requires_premium) VALUES
('anxiety-relief-7d', '7-Day Anxiety Relief', 'A week-long journey to find calm, build resilience, and develop healthy coping mechanisms for anxiety.', 7, 'Mental Health', 'beginner', 
    ARRAY['Acknowledging Your Feelings', 'Grounding in the Present', 'Releasing Physical Tension', 'Cultivating Self-Compassion', 'Challenging Anxious Thoughts', 'Finding Your Inner Strength', 'Integrating Calm into Daily Life'], false),

('sleep-mastery-14d', '14-Day Sleep Mastery', 'Transform your sleep with evidence-based techniques for better rest, relaxation, and rejuvenation.', 14, 'Sleep', 'beginner',
    ARRAY['Understanding Your Sleep', 'Creating a Bedtime Ritual', 'Progressive Relaxation', 'Breathwork for Sleep', 'Releasing the Day', 'Body Scan Meditation', 'Gentle Visualization', 'Managing Racing Thoughts', 'Sleep Environment Optimization', 'Daytime Habits', 'Napping Wisdom', 'Weekend Sleep', 'Long-term Habits', 'Celebration & Reflection'], false),

('mindfulness-21d', '21-Day Mindfulness Foundation', 'Build a lasting mindfulness practice with daily guided sessions designed for busy lives.', 21, 'Mindfulness', 'intermediate',
    ARRAY['What is Mindfulness?', 'Present Moment Awareness', 'Mindful Breathing', 'Body Awareness', 'Thought Observation', 'Emotional Awareness', 'Mindful Listening', 'Mindful Eating', 'Walking Meditation', 'Loving-Kindness', 'Gratitude Practice', 'Mindful Movement', 'Observing Judgments', 'Mindful Communication', 'Stress Response', 'Self-Compassion', 'Daily Integration', 'Mindful Relationships', 'Difficult Emotions', 'Life Purpose', 'Sustaining Practice'], true),

('confidence-boost-10d', '10-Day Confidence Boost', 'Develop unshakeable self-confidence through affirmations, visualization, and empowering practices.', 10, 'Personal Growth', 'beginner',
    ARRAY['Discovering Your Strengths', 'Challenging Self-Doubt', 'Power Poses & Presence', 'Speaking Your Truth', 'Setting Boundaries', 'Celebrating Small Wins', 'Visualization Practice', 'Authentic Self-Expression', 'Handling Criticism', 'Owning Your Success'], false);

-- Seed Data - Initial Support Groups
INSERT INTO public.support_groups (name, topic, description, is_anonymous, max_members, is_moderated) VALUES
('Anxiety Warriors', 'Anxiety Management', 'A safe space for those managing anxiety to share experiences and coping strategies.', true, 100, true),
('Sleep Seekers', 'Sleep Issues', 'Connect with others working to improve their sleep quality and establish healthy sleep routines.', true, 100, true),
('Mindful Living Circle', 'Mindfulness Practice', 'For those committed to building and maintaining a mindfulness practice in daily life.', true, 50, true),
('New Parents Support', 'Parenting Stress', 'Supporting parents through the challenges of raising children while maintaining wellness.', true, 75, true),
('Career Transitions', 'Work-Life Balance', 'Navigate career changes and professional challenges with peer support.', true, 60, true);

-- Seed Data - Sample Challenges
INSERT INTO public.challenges (title, description, category, duration_days, goal_description, target_sessions, target_streak, xp_reward, badge_icon) VALUES
('7-Day Streak Builder', 'Complete a wellness session for 7 consecutive days', 'Consistency', 7, 'Build a solid foundation with one week of consistent practice', 7, 7, 500, '🔥'),
('Mindful March', 'Complete 20 sessions in 30 days', 'Volume', 30, 'Dedicate yourself to regular wellness practice', 20, 0, 1000, '🎯'),
('Gratitude Guru', 'Share 30 gratitude entries in 30 days', 'Gratitude', 30, 'Transform your mindset with daily gratitude', 30, 0, 750, '🙏'),
('Early Bird', 'Complete 10 morning sessions', 'Timing', 0, 'Start your day with intention and mindfulness', 10, 0, 300, '🌅'),
('Program Completionist', 'Finish any 7-day program', 'Programs', 0, 'See a structured program through to completion', 7, 0, 800, '🏆');

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- User Stats View
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    up.id as user_id,
    up.name,
    up.xp,
    up.level,
    up.streak,
    up.subscription_tier,
    COUNT(DISTINCT s.id) as total_sessions,
    COUNT(DISTINCT a.id) as total_achievements,
    COUNT(DISTINCT g.id) as total_gratitude_entries,
    COUNT(DISTINCT je.id) as total_journal_entries,
    COUNT(DISTINCT upp.id) FILTER (WHERE upp.is_completed = true) as completed_programs,
    COUNT(DISTINCT uc.id) FILTER (WHERE uc.is_completed = true) as completed_challenges
FROM public.user_profiles up
LEFT JOIN public.sessions s ON up.id = s.user_id
LEFT JOIN public.achievements a ON up.id = a.user_id
LEFT JOIN public.gratitude_entries g ON up.id = g.user_id
LEFT JOIN public.journal_entries je ON up.id = je.user_id
LEFT JOIN public.user_program_progress upp ON up.id = upp.user_id
LEFT JOIN public.user_challenges uc ON up.id = uc.user_id
GROUP BY up.id;

-- Recent Activity View
CREATE OR REPLACE VIEW recent_activity AS
SELECT 
    user_id,
    'session' as activity_type,
    id as activity_id,
    date as activity_date,
    mood as activity_detail
FROM public.sessions
UNION ALL
SELECT 
    user_id,
    'achievement' as activity_type,
    id as activity_id,
    date as activity_date,
    title as activity_detail
FROM public.achievements
UNION ALL
SELECT 
    user_id,
    'gratitude' as activity_type,
    id as activity_id,
    date as activity_date,
    word as activity_detail
FROM public.gratitude_entries
ORDER BY activity_date DESC;

-- =====================================================
-- COMMENTS & DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.user_profiles IS 'Extended user profile information beyond Supabase auth';
COMMENT ON TABLE public.sessions IS 'Completed wellness sessions with mood tracking and reflections';
COMMENT ON TABLE public.achievements IS 'User achievements and milestones';
COMMENT ON TABLE public.gratitude_entries IS 'Daily gratitude words shared in the community';
COMMENT ON TABLE public.journal_entries IS 'Personal journal entries with AI insights';
COMMENT ON TABLE public.programs IS 'Structured wellness programs with daily themes';
COMMENT ON TABLE public.user_program_progress IS 'Tracks user progress through programs';
COMMENT ON TABLE public.challenges IS 'Time-based or goal-based wellness challenges';
COMMENT ON TABLE public.user_challenges IS 'User participation in challenges';
COMMENT ON TABLE public.support_groups IS 'Anonymous support groups for various topics';
COMMENT ON TABLE public.therapists IS 'Licensed therapist directory';
COMMENT ON TABLE public.wellness_events IS 'Virtual and in-person wellness events';
COMMENT ON TABLE public.xp_transactions IS 'Audit trail for all XP changes';

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_sessions_user_date ON public.sessions(user_id, date DESC);
CREATE INDEX idx_achievements_user_date ON public.achievements(user_id, date DESC);
CREATE INDEX idx_gratitude_user_public_date ON public.gratitude_entries(user_id, is_public, date DESC);
CREATE INDEX idx_programs_category_active ON public.programs(category, is_active);
CREATE INDEX idx_challenges_dates ON public.challenges(start_date, end_date, is_active);

-- Full-text search indexes
CREATE INDEX idx_programs_search ON public.programs USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_therapists_search ON public.therapists USING gin(to_tsvector('english', name || ' ' || bio));

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant table permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.programs, public.challenges, public.support_groups, public.therapists, public.wellness_events TO anon;

-- Grant sequence permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION add_xp_to_user TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_level TO authenticated;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
