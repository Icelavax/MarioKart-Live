-- ==========================================================================
-- PRESENTATION NOTE
-- database/schema.sql - the 7 tables
--
-- What to say: One table per entity class; column names are the entity attributes in snake_case.
--              db.js creates these tables in Neon automatically on the first start (CREATE TABLE
--              IF NOT EXISTS).
--
-- Q: How are the tables linked?
-- A: user_accounts.profile_id points to user_profiles; idps point to their designer and category;
--    idp_view_records and saved_idps point to an IDP and a customer.
-- ==========================================================================

-- For LATER, when the database is added. Not used yet.
-- One table per entity class. Column names = entity attributes in snake_case.

CREATE TABLE user_profiles (
    profile_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_name   VARCHAR(100) NOT NULL UNIQUE,
    description    TEXT,
    profile_status VARCHAR(20)  NOT NULL DEFAULT 'Active',
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_accounts (
    user_id        INTEGER PRIMARY KEY AUTOINCREMENT,
    username       VARCHAR(50)  NOT NULL UNIQUE,
    email          VARCHAR(100) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    full_name      VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20),
    profile_id     INTEGER      NOT NULL REFERENCES user_profiles(profile_id),
    account_status VARCHAR(20)  NOT NULL DEFAULT 'Active',   -- 'Active' or 'Suspended'
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_profiles (
    company_id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id             INTEGER      NOT NULL UNIQUE REFERENCES user_accounts(user_id),
    company_name        VARCHAR(150) NOT NULL,
    registration_number VARCHAR(50)  NOT NULL,
    company_description TEXT,
    contact_email       VARCHAR(100) NOT NULL,
    contact_number      VARCHAR(20)  NOT NULL
);

CREATE TABLE idp_categories (
    category_id          INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name        VARCHAR(100) NOT NULL UNIQUE,
    category_description TEXT,
    created_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE idps (
    idp_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    designer_id    INTEGER      NOT NULL REFERENCES user_accounts(user_id),
    category_id    INTEGER      NOT NULL REFERENCES idp_categories(category_id),
    title          VARCHAR(150) NOT NULL,
    description    TEXT         NOT NULL,
    design_style   VARCHAR(100),
    project_status VARCHAR(20)  NOT NULL DEFAULT 'Current',   -- 'Current' or 'Past'
    image_url      VARCHAR(255),
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at   DATETIME,
    shortlist_count INTEGER     NOT NULL DEFAULT 0
);

CREATE TABLE idp_view_records (
    view_record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    idp_id         INTEGER  NOT NULL REFERENCES idps(idp_id),
    customer_id    INTEGER  NOT NULL REFERENCES user_accounts(user_id),
    viewed_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE saved_idps (
    customer_id INTEGER  NOT NULL REFERENCES user_accounts(user_id),
    idp_id      INTEGER  NOT NULL REFERENCES idps(idp_id),
    saved_date  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (customer_id, idp_id)
);
-- Daily / Weekly / Monthly reports are calculated from the tables above, not stored.
