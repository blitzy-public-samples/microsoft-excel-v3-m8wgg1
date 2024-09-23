-- Sample Users
-- Covering various roles and scenarios
INSERT INTO Users (id, name, email, password_hash, role) VALUES
('u1', 'John Doe', 'john@example.com', 'hashed_password_1', 'Administrator'),
('u2', 'Jane Smith', 'jane@example.com', 'hashed_password_2', 'Editor'),
('u3', 'Bob Johnson', 'bob@example.com', 'hashed_password_3', 'Viewer'),
('u4', 'Alice Brown', 'alice@example.com', 'hashed_password_4', 'Editor'),
('u5', 'Charlie Davis', 'charlie@example.com', 'hashed_password_5', 'Viewer');

-- Sample Workbooks
-- Including various types of workbooks with different complexities
INSERT INTO Workbooks (id, name, owner_id) VALUES
('w1', 'Financial Report 2023', 'u1'),
('w2', 'Project Timeline', 'u2'),
('w3', 'Sales Data', 'u1'),
('w4', 'Inventory Tracking', 'u4'),
('w5', 'Employee Performance Review', 'u1');

-- Sample WorkbookPermissions
-- Demonstrating different permission scenarios
INSERT INTO WorkbookPermissions (workbook_id, user_id, permission) VALUES
('w1', 'u2', 'Read'),
('w1', 'u3', 'Read'),
('w2', 'u1', 'Write'),
('w2', 'u3', 'Read'),
('w3', 'u2', 'Write'),
('w3', 'u4', 'Read'),
('w4', 'u1', 'Write'),
('w4', 'u2', 'Write'),
('w4', 'u3', 'Read'),
('w5', 'u2', 'Write'),
('w5', 'u3', 'Read'),
('w5', 'u4', 'Write');

-- Sample CollaborationSessions
-- Representing ongoing collaboration sessions
INSERT INTO CollaborationSessions (id, workbook_id) VALUES
('cs1', 'w1'),
('cs2', 'w2'),
('cs3', 'w4');

-- Sample CollaborationParticipants
-- Showing various collaboration scenarios
INSERT INTO CollaborationParticipants (session_id, user_id) VALUES
('cs1', 'u1'),
('cs1', 'u2'),
('cs2', 'u1'),
('cs2', 'u2'),
('cs2', 'u3'),
('cs3', 'u1'),
('cs3', 'u2'),
('cs3', 'u4');

-- Sample Comments
-- Demonstrating comments in different contexts
INSERT INTO Comments (id, workbook_id, worksheet_name, cell_address, user_id, content) VALUES
('c1', 'w1', 'Sheet1', 'A1', 'u2', 'Please verify this value'),
('c2', 'w2', 'Timeline', 'C5', 'u1', 'Deadline needs to be adjusted'),
('c3', 'w3', 'Sales2023', 'B10', 'u4', 'This figure seems unusually high'),
('c4', 'w4', 'Inventory', 'D15', 'u2', 'Stock level is below threshold'),
('c5', 'w5', 'Ratings', 'F7', 'u1', 'Exceptional performance noted');

-- Sample ChangeHistory
-- Showing various types of changes in different workbooks
INSERT INTO ChangeHistory (id, workbook_id, worksheet_name, cell_address, user_id, old_value, new_value) VALUES
('ch1', 'w1', 'Sheet1', 'B3', 'u1', '1000', '1500'),
('ch2', 'w2', 'Timeline', 'D10', 'u2', '2023-06-01', '2023-07-01'),
('ch3', 'w3', 'Sales2023', 'C7', 'u4', '50000', '55000'),
('ch4', 'w4', 'Inventory', 'E20', 'u2', '100', '75'),
('ch5', 'w5', 'Ratings', 'G12', 'u1', '3', '4');

-- Sample Worksheets (assuming a Worksheets table exists)
INSERT INTO Worksheets (id, workbook_id, name) VALUES
('ws1', 'w1', 'Income Statement'),
('ws2', 'w1', 'Balance Sheet'),
('ws3', 'w2', 'Gantt Chart'),
('ws4', 'w3', 'Monthly Sales'),
('ws5', 'w3', 'Quarterly Summary'),
('ws6', 'w4', 'Current Stock'),
('ws7', 'w4', 'Order History'),
('ws8', 'w5', 'Individual Scores'),
('ws9', 'w5', 'Department Summary');

-- Sample Cells (assuming a Cells table exists)
-- Including examples of formulas, merged cells, and different data types
INSERT INTO Cells (worksheet_id, address, value, formula, is_merged, merge_range) VALUES
('ws1', 'A1', 'Revenue', NULL, false, NULL),
('ws1', 'B2', 1000000, NULL, false, NULL),
('ws1', 'C5', NULL, '=SUM(B2:B4)', false, NULL),
('ws2', 'D10:E11', 'Total Assets', NULL, true, 'D10:E11'),
('ws3', 'A1:Z1', 'Project Timeline', NULL, true, 'A1:Z1'),
('ws4', 'B5', '2023-01-15', NULL, false, NULL),
('ws5', 'C7', 0.15, '=B7/100', false, NULL);

-- Sample Charts (assuming a Charts table exists)
INSERT INTO Charts (id, worksheet_id, type, data_range) VALUES
('ch1', 'ws4', 'Bar', 'A1:D12'),
('ch2', 'ws5', 'Pie', 'B2:B5'),
('ch3', 'ws6', 'Line', 'A1:C50');