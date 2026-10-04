-- Setup authentication for external connections with MD5
-- This file runs before table creation

-- Set password encryption to md5 for compatibility
SET password_encryption = 'md5';

-- Ensure shoe_admin user exists with correct password
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'shoe_admin') THEN
        ALTER USER shoe_admin WITH PASSWORD 'shoe1234';
    ELSE
        CREATE USER shoe_admin WITH PASSWORD 'shoe1234' SUPERUSER CREATEDB CREATEROLE REPLICATION;
    END IF;
END
$$;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE shoe_store TO shoe_admin;

-- Log success
DO $$
BEGIN
    RAISE NOTICE 'User shoe_admin configured successfully with MD5 authentication';
END
$$;
