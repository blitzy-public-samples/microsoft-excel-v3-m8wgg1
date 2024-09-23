CREATE TABLE Users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    preferences JSON,
    CONSTRAINT chk_role CHECK (role IN ('Viewer', 'Editor', 'Contributor', 'Administrator'))
);

-- Add index for email column
CREATE INDEX idx_users_email ON Users(email);

-- Add index for role column
CREATE INDEX idx_users_role ON Users(role);

-- Add account_status column
ALTER TABLE Users ADD COLUMN account_status VARCHAR(20) DEFAULT 'active';

-- Add constraint for account_status
ALTER TABLE Users ADD CONSTRAINT chk_account_status CHECK (account_status IN ('active', 'suspended', 'deleted'));

-- Add profile_picture_url column
ALTER TABLE Users ADD COLUMN profile_picture_url VARCHAR(255);