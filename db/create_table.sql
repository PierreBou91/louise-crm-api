DROP TABLE IF EXISTS persons;
DROP TABLE IF EXISTS organisations;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS actions;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS roles;

CREATE TABLE persons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    password_hash VARCHAR,
    phone_number VARCHAR,
    is_user BOOLEAN DEFAULT FALSE,
    comment_id_list UUID[],
    action_id_list UUID[],
    owner_id UUID,
    team_id UUID,
    org_id UUID,
    role_id UUID,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE organisations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    org_name VARCHAR NOT NULL,
    is_client BOOLEAN DEFAULT FALSE,
    owner_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE teams (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    label VARCHAR NOT NULL,
    owner_org_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE actions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    label VARCHAR NOT NULL,
    target_date TIMESTAMP WITH TIME ZONE,
    is_done BOOLEAN DEFAULT FALSE,
    contact_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE roles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    label VARCHAR,
    team_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);