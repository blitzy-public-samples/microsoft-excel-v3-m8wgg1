CREATE TABLE CollaborationSessions (
    id VARCHAR(36) PRIMARY KEY,
    workbook_id VARCHAR(36) NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    FOREIGN KEY (workbook_id) REFERENCES Workbooks(id) ON DELETE CASCADE
);

CREATE TABLE CollaborationParticipants (
    session_id VARCHAR(36),
    user_id VARCHAR(36),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    PRIMARY KEY (session_id, user_id),
    FOREIGN KEY (session_id) REFERENCES CollaborationSessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Comments (
    id VARCHAR(36) PRIMARY KEY,
    workbook_id VARCHAR(36) NOT NULL,
    worksheet_name VARCHAR(255) NOT NULL,
    cell_address VARCHAR(20) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolved_by VARCHAR(36),
    FOREIGN KEY (workbook_id) REFERENCES Workbooks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (resolved_by) REFERENCES Users(id)
);

CREATE TABLE ChangeHistory (
    id VARCHAR(36) PRIMARY KEY,
    workbook_id VARCHAR(36) NOT NULL,
    worksheet_name VARCHAR(255) NOT NULL,
    cell_address VARCHAR(20) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workbook_id) REFERENCES Workbooks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);