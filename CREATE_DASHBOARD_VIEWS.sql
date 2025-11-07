-- ============================================
-- DASHBOARD VIEWS FOR PALM WORKER ANALYTICS
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop existing views if they exist
DROP VIEW IF EXISTS dashboard_workers_by_country CASCADE;
DROP VIEW IF EXISTS dashboard_workers_by_state CASCADE;
DROP VIEW IF EXISTS dashboard_workers_by_industry CASCADE;
DROP VIEW IF EXISTS dashboard_summary CASCADE;

-- ============================================
-- 1. Workers by Country View
-- ============================================
CREATE OR REPLACE VIEW dashboard_workers_by_country AS
SELECT
    country,
    COUNT(*) as worker_count,
    COUNT(CASE WHEN registration_complete = true THEN 1 END) as registered_count,
    ROUND(
        (COUNT(CASE WHEN registration_complete = true THEN 1 END)::NUMERIC /
        NULLIF(COUNT(*), 0) * 100)::NUMERIC,
        1
    ) as registration_rate
FROM users
WHERE country IS NOT NULL AND country != ''
GROUP BY country
ORDER BY worker_count DESC;

-- ============================================
-- 2. Workers by State View
-- ============================================
CREATE OR REPLACE VIEW dashboard_workers_by_state AS
SELECT
    state,
    COUNT(*) as worker_count,
    COUNT(CASE WHEN registration_complete = true THEN 1 END) as registered_count,
    ROUND(
        (COUNT(CASE WHEN registration_complete = true THEN 1 END)::NUMERIC /
        NULLIF(COUNT(*), 0) * 100)::NUMERIC,
        1
    ) as registration_rate
FROM users
WHERE state IS NOT NULL AND state != ''
GROUP BY state
ORDER BY worker_count DESC;

-- ============================================
-- 3. Workers by Industry View
-- ============================================
CREATE OR REPLACE VIEW dashboard_workers_by_industry AS
SELECT
    industry,
    COUNT(*) as worker_count,
    COUNT(CASE WHEN registration_complete = true THEN 1 END) as registered_count,
    ROUND(
        (COUNT(CASE WHEN registration_complete = true THEN 1 END)::NUMERIC /
        NULLIF(COUNT(*), 0) * 100)::NUMERIC,
        1
    ) as registration_rate
FROM users
WHERE industry IS NOT NULL AND industry != ''
GROUP BY industry
ORDER BY worker_count DESC;

-- ============================================
-- 4. Dashboard Summary View
-- ============================================
CREATE OR REPLACE VIEW dashboard_summary AS
SELECT
    COUNT(*) as total_users,
    COUNT(CASE WHEN registration_complete = true THEN 1 END) as registered_users,
    COUNT(CASE WHEN last_active > NOW() - INTERVAL '7 days' THEN 1 END) as active_users_7d,
    COUNT(CASE WHEN last_active > NOW() - INTERVAL '30 days' THEN 1 END) as active_users_30d,
    (SELECT COUNT(*) FROM conversations) as total_messages,
    (SELECT COUNT(*) FROM survey_responses) as total_survey_responses,
    (SELECT COUNT(*) FROM distress_alerts WHERE resolved = false) as unresolved_alerts
FROM users;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Test the views
SELECT * FROM dashboard_workers_by_country LIMIT 5;
SELECT * FROM dashboard_workers_by_state LIMIT 5;
SELECT * FROM dashboard_workers_by_industry LIMIT 5;
SELECT * FROM dashboard_summary;

-- Grant access to views
GRANT SELECT ON dashboard_workers_by_country TO anon, authenticated, service_role;
GRANT SELECT ON dashboard_workers_by_state TO anon, authenticated, service_role;
GRANT SELECT ON dashboard_workers_by_industry TO anon, authenticated, service_role;
GRANT SELECT ON dashboard_summary TO anon, authenticated, service_role;

COMMIT;
