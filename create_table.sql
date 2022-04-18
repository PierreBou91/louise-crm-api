DROP TABLE IF EXISTS persons;
DROP TABLE IF EXISTS organisations;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS actions;
DROP TABLE IF EXISTS phones;
DROP TABLE IF EXISTS roles;

CREATE TABLE persons (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    password_hash VARCHAR,
    phone_id_list INTEGER[],
    is_user BOOLEAN DEFAULT FALSE,
    owner_id INTEGER,
    team_id INTEGER,
    org_id INTEGER,
    role_id INTEGER,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE organisations (
    id SERIAL PRIMARY KEY,
    org_name VARCHAR NOT NULL,
    is_client BOOLEAN DEFAULT FALSE,
    owner_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    label VARCHAR NOT NULL,
    owner_org_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE actions (
    id SERIAL PRIMARY KEY,
    label VARCHAR NOT NULL,
    owner_id INTEGER,
    contact_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    label VARCHAR,
    team_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);