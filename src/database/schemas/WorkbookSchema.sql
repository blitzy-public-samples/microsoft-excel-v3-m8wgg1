CREATE TABLE Workbooks (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP,
    version INT DEFAULT 1,
    is_template BOOLEAN DEFAULT FALSE,
    metadata JSON,
    FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE WorkbookPermissions (
    workbook_id VARCHAR(36),
    user_id VARCHAR(36),
    permission VARCHAR(50) NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by VARCHAR(36),
    PRIMARY KEY (workbook_id, user_id),
    FOREIGN KEY (workbook_id) REFERENCES Workbooks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES Users(id),
    CONSTRAINT chk_permission CHECK (permission IN ('Read', 'Write', 'Share', 'Delete'))
);