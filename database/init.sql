USE crm_followup;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'manager', 'agent') NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    company_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    added_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (added_by) REFERENCES users(id)
);

-- Follow-ups table
CREATE TABLE IF NOT EXISTS follow_ups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    assigned_to INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed', 'overdue') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    due_date DATETIME NOT NULL,
    completed_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Follow-up History table
CREATE TABLE IF NOT EXISTS follow_up_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    follow_up_id INT NOT NULL,
    action_by INT NOT NULL,
    action_type ENUM('status_change', 'note_added', 'reminder_sent') NOT NULL,
    action_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follow_up_id) REFERENCES follow_ups(id),
    FOREIGN KEY (action_by) REFERENCES users(id)
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#000000',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Follow-up Tags table
CREATE TABLE IF NOT EXISTS follow_up_tags (
    follow_up_id INT,
    tag_id INT,
    PRIMARY KEY (follow_up_id, tag_id),
    FOREIGN KEY (follow_up_id) REFERENCES follow_ups(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    follow_up_id INT NOT NULL,
    reminder_date DATETIME NOT NULL,
    reminder_type ENUM('email', 'sms', 'notification') NOT NULL,
    reminder_status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follow_up_id) REFERENCES follow_ups(id)
);

-- Insert dummy data
-- Users
INSERT INTO users (full_name, email, password_hash, phone, role) VALUES
('John Admin', 'admin@example.com', '$2a$12$1234567890123456789012', '+1234567890', 'admin'),
('Sarah Manager', 'manager@example.com', '$2a$12$1234567890123456789012', '+1234567891', 'manager'),
('Mike Agent', 'agent@example.com', '$2a$12$1234567890123456789012', '+1234567892', 'agent');

-- Clients
INSERT INTO clients (name, company_name, email, phone, address, added_by) VALUES
('Alice Cooper', 'Tech Corp', 'alice@techcorp.com', '+1111111111', '123 Tech St, Silicon Valley', 1),
('Bob Wilson', 'Digital Solutions', 'bob@digitalsolutions.com', '+2222222222', '456 Digital Ave, New York', 2),
('Carol Smith', 'Innovation Inc', 'carol@innovation.com', '+3333333333', '789 Innovation Rd, Boston', 3);

-- Tags
INSERT INTO tags (name, color) VALUES
('Urgent', '#ff0000'),
('Follow-up', '#00ff00'),
('Meeting', '#0000ff'),
('Important', '#ffa500');

-- Follow-ups
INSERT INTO follow_ups (client_id, assigned_to, title, description, status, priority, due_date) VALUES
(1, 2, 'Quarterly Review Meeting', 'Discuss Q2 performance and future plans', 'pending', 'high', DATE_ADD(NOW(), INTERVAL 2 DAY)),
(2, 3, 'Contract Renewal Discussion', 'Review and renew annual contract', 'in_progress', 'medium', DATE_ADD(NOW(), INTERVAL 5 DAY)),
(3, 2, 'New Project Proposal', 'Present new project ideas and budget', 'pending', 'high', DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 3, 'Technical Support Follow-up', 'Check if recent technical issues are resolved', 'completed', 'low', DATE_ADD(NOW(), INTERVAL -1 DAY)),
(2, 2, 'Payment Follow-up', 'Follow up on pending invoice payment', 'overdue', 'high', DATE_ADD(NOW(), INTERVAL -2 DAY));

-- Follow-up Tags
INSERT INTO follow_up_tags (follow_up_id, tag_id) VALUES
(1, 1), (1, 3),
(2, 2),
(3, 1), (3, 4),
(4, 2),
(5, 1), (5, 2);

-- Follow-up History
INSERT INTO follow_up_history (follow_up_id, action_by, action_type, action_notes) VALUES
(1, 2, 'note_added', 'Initial meeting agenda sent to client'),
(2, 3, 'status_change', 'Started contract review process'),
(3, 2, 'reminder_sent', 'Sent meeting reminder to all stakeholders'),
(4, 3, 'status_change', 'Marked as completed after confirmation from client'),
(5, 2, 'reminder_sent', 'Payment reminder sent to accounts department');

-- Reminders
INSERT INTO reminders (follow_up_id, reminder_date, reminder_type, reminder_status) VALUES
(1, DATE_ADD(NOW(), INTERVAL 1 DAY), 'email', 'pending'),
(2, DATE_ADD(NOW(), INTERVAL 2 DAY), 'sms', 'sent'),
(3, DATE_ADD(NOW(), INTERVAL 4 HOUR), 'notification', 'pending'),
(4, DATE_ADD(NOW(), INTERVAL -1 DAY), 'email', 'sent'),
(5, DATE_ADD(NOW(), INTERVAL -1 HOUR), 'sms', 'failed'); 