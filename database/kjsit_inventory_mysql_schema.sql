-- ============================================================
-- KJSIT Inventory Management System - MySQL Schema
-- ============================================================
-- This schema is designed for MySQL database
-- Compatible with MySQL 5.7+ and MySQL 8.0+
-- ============================================================

-- Create database (run this separately if needed)
-- CREATE DATABASE IF NOT EXISTS kjsit_inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE kjsit_inventory;

-- ============================================================
-- Table: users
-- Description: System users with role-based access
-- Roles: admin, staff, faculty, student
-- ============================================================
-- hellloooo
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('admin', 'staff', 'faculty', 'student') NOT NULL,
    department_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_department (department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: categories
-- Description: Product categories (Electronics, Computers, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: departments
-- Description: College departments
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: inventory_items
-- Description: Core inventory items with approval workflow
-- Status: pending (staff added, awaiting approval), approved, rejected
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT NOT NULL,
    department_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    total_quantity INT NOT NULL,
    unit VARCHAR(20) DEFAULT 'pcs',
    is_borrowable BOOLEAN DEFAULT FALSE,
    is_issuable BOOLEAN DEFAULT FALSE,
    borrowable_by JSON,
    issuable_by JSON,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    created_by INT,
    approved_by INT,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_quantity CHECK (quantity >= 0),
    CONSTRAINT chk_total_quantity CHECK (total_quantity >= 0),
    CONSTRAINT chk_quantity_lte_total CHECK (quantity <= total_quantity),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_department (department_id),
    INDEX idx_status (status),
    INDEX idx_created_by (created_by),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: transactions
-- Description: Borrow and Issue transaction requests
-- Transaction Types: borrow (temporary), issue (permanent)
-- Status: pending, approved, rejected, returned (for borrow), issued (for issue)
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    user_id INT NOT NULL,
    quantity INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'returned', 'issued') NOT NULL DEFAULT 'pending',
    transaction_type ENUM('borrow', 'issue') NOT NULL,
    reason TEXT,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_date TIMESTAMP NULL,
    return_date TIMESTAMP NULL,
    approved_by INT,
    remarks TEXT,
    CONSTRAINT chk_transaction_quantity CHECK (quantity > 0),
    FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_item (item_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_request_date (request_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: damage_reports
-- Description: Track damaged, lost, or malfunctioning items
-- ============================================================
CREATE TABLE IF NOT EXISTS damage_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    reported_by INT NOT NULL,
    type ENUM('damage', 'loss', 'malfunction') NOT NULL,
    severity ENUM('minor', 'major', 'total_loss') NOT NULL,
    description TEXT NOT NULL,
    estimated_cost DECIMAL(10, 2),
    status ENUM('reported', 'under_review', 'repair_in_progress', 'replaced', 'resolved') DEFAULT 'reported',
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_to INT,
    resolved_at TIMESTAMP NULL,
    resolution_notes TEXT,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE RESTRICT,
    FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_item (item_id),
    INDEX idx_reported_by (reported_by),
    INDEX idx_status (status),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: issued_items
-- Description: Track permanently issued items
-- ============================================================
CREATE TABLE IF NOT EXISTS issued_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    item_id INT NOT NULL,
    issued_to INT NOT NULL,
    issued_by INT,
    quantity INT NOT NULL,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'revoked') DEFAULT 'active',
    notes TEXT,
    revoked_at TIMESTAMP NULL,
    revoked_by INT,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE RESTRICT,
    FOREIGN KEY (issued_to) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (revoked_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_transaction (transaction_id),
    INDEX idx_item (item_id),
    INDEX idx_issued_to (issued_to),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Insert sample departments
INSERT INTO departments (name, description) VALUES
('Computer Engineering', 'Computer Science and Engineering Department'),
('Information Technology', 'Information Technology Department'),
('AI & Data Science', 'Artificial Intelligence and Data Science Department'),
('Electronics & Telecommunication', 'Electronics and Telecommunication Engineering Department'),
('Basic Sciences & Humanities', 'Basic Sciences and Humanities Department'),
('Administration', 'Administrative Department'),
('Student Facilities', 'Student Facilities and Services');

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and components'),
('Computers', 'Computer hardware and systems'),
('Lab Equipment', 'Laboratory instruments and tools'),
('Furniture', 'Office and classroom furniture'),
('Stationery', 'Office supplies and stationery items'),
('Sports Equipment', 'Sports and recreational equipment'),
('Networking', 'Network devices and infrastructure'),
('Software', 'Software licenses and subscriptions'),
('Chemicals', 'Laboratory chemicals and reagents'),
('Books', 'Academic books and reference materials');

-- Insert sample users (password should be hashed in production)
INSERT INTO users (username, password_hash, name, email, role, department_id) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin@kjsit.edu.in', 'admin', 6),
('staff1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Staff Member', 'staff@kjsit.edu.in', 'staff', 1),
('faculty1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Jane Smith', 'jane.smith@kjsit.edu.in', 'faculty', 1),
('student1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'john@somaiya.edu', 'student', 1),
('staff2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Staff Member', 'staff2@kjsit.edu.in', 'staff', 1),
('student2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'JAY', 'jay@somaiya.edu', 'student', 1);

-- ============================================================
-- VIEWS for Common Queries
-- ============================================================

-- View: Available items for borrowing/issuing
CREATE OR REPLACE VIEW available_items AS
SELECT
    i.id,
    i.name,
    i.description,
    i.quantity,
    i.total_quantity,
    i.unit,
    i.is_borrowable,
    i.is_issuable,
    i.borrowable_by,
    i.issuable_by,
    c.name AS category_name,
    d.name AS department_name
FROM inventory_items i
JOIN categories c ON i.category_id = c.id
JOIN departments d ON i.department_id = d.id
WHERE i.status = 'approved' AND i.quantity > 0;

-- View: Pending transactions
CREATE OR REPLACE VIEW pending_transactions AS
SELECT
    t.id,
    t.transaction_type,
    t.quantity,
    t.reason,
    t.request_date,
    i.name AS item_name,
    u.name AS user_name,
    u.role AS user_role,
    d.name AS department_name
FROM transactions t
JOIN inventory_items i ON t.item_id = i.id
JOIN users u ON t.user_id = u.id
JOIN departments d ON u.department_id = d.id
WHERE t.status = 'pending'
ORDER BY t.request_date DESC;

-- View: Low stock items
CREATE OR REPLACE VIEW low_stock_items AS
SELECT
    i.id,
    i.name,
    i.quantity,
    i.total_quantity,
    ROUND((i.quantity / i.total_quantity) * 100, 2) AS stock_percentage,
    c.name AS category_name,
    d.name AS department_name
FROM inventory_items i
JOIN categories c ON i.category_id = c.id
JOIN departments d ON i.department_id = d.id
WHERE i.status = 'approved'
AND i.quantity <= (i.total_quantity * 0.2)
ORDER BY stock_percentage ASC;

-- View: Active borrowings
CREATE OR REPLACE VIEW active_borrowings AS
SELECT
    t.id,
    i.name AS item_name,
    u.name AS user_name,
    u.role AS user_role,
    t.quantity,
    t.request_date,
    t.approved_date,
    DATEDIFF(CURRENT_DATE, t.approved_date) AS days_borrowed
FROM transactions t
JOIN inventory_items i ON t.item_id = i.id
JOIN users u ON t.user_id = u.id
WHERE t.transaction_type = 'borrow'
AND t.status = 'approved'
ORDER BY t.approved_date DESC;

-- ============================================================
-- STORED PROCEDURES
-- ============================================================

-- Procedure: Approve item (admin only)
DELIMITER //
CREATE PROCEDURE approve_item(
    IN p_item_id INT,
    IN p_admin_id INT
)
BEGIN
    DECLARE v_user_role VARCHAR(20);

    SELECT role INTO v_user_role FROM users WHERE id = p_admin_id;

    IF v_user_role = 'admin' THEN
        UPDATE inventory_items
        SET status = 'approved',
            approved_by = p_admin_id,
            approved_at = CURRENT_TIMESTAMP
        WHERE id = p_item_id AND status = 'pending';
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only admins can approve items';
    END IF;
END //
DELIMITER ;

-- Procedure: Process transaction approval
DELIMITER //
CREATE PROCEDURE approve_transaction(
    IN p_transaction_id INT,
    IN p_admin_id INT
)
BEGIN
    DECLARE v_item_id INT;
    DECLARE v_quantity INT;
    DECLARE v_available_qty INT;
    DECLARE v_trans_type VARCHAR(20);
    DECLARE v_user_role VARCHAR(20);

    SELECT role INTO v_user_role FROM users WHERE id = p_admin_id;

    IF v_user_role != 'admin' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only admins can approve transactions';
    END IF;

    SELECT item_id, quantity, transaction_type
    INTO v_item_id, v_quantity, v_trans_type
    FROM transactions
    WHERE id = p_transaction_id;

    SELECT quantity INTO v_available_qty FROM inventory_items WHERE id = v_item_id;

    IF v_available_qty < v_quantity THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient quantity available';
    END IF;

    START TRANSACTION;
        UPDATE inventory_items
        SET quantity = quantity - v_quantity
        WHERE id = v_item_id;

        IF v_trans_type = 'borrow' THEN
            UPDATE transactions
            SET status = 'approved',
                approved_by = p_admin_id,
                approved_date = CURRENT_TIMESTAMP
            WHERE id = p_transaction_id;
        ELSE
            UPDATE transactions
            SET status = 'issued',
                approved_by = p_admin_id,
                approved_date = CURRENT_TIMESTAMP
            WHERE id = p_transaction_id;

            INSERT INTO issued_items (transaction_id, item_id, issued_to, issued_by, quantity)
            SELECT id, item_id, user_id, p_admin_id, quantity
            FROM transactions
            WHERE id = p_transaction_id;
        END IF;
    COMMIT;
END //
DELIMITER ;

-- Procedure: Return borrowed item
DELIMITER //
CREATE PROCEDURE return_item(
    IN p_transaction_id INT
)
BEGIN
    DECLARE v_item_id INT;
    DECLARE v_quantity INT;

    SELECT item_id, quantity
    INTO v_item_id, v_quantity
    FROM transactions
    WHERE id = p_transaction_id AND transaction_type = 'borrow' AND status = 'approved';

    START TRANSACTION;
        UPDATE inventory_items
        SET quantity = quantity + v_quantity
        WHERE id = v_item_id;

        UPDATE transactions
        SET status = 'returned',
            return_date = CURRENT_TIMESTAMP
        WHERE id = p_transaction_id;
    COMMIT;
END //
DELIMITER ;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Trigger: Prevent deletion of items with active transactions
DELIMITER //
CREATE TRIGGER prevent_item_deletion
BEFORE DELETE ON inventory_items
FOR EACH ROW
BEGIN
    DECLARE v_count INT;

    SELECT COUNT(*) INTO v_count
    FROM transactions
    WHERE item_id = OLD.id
    AND status IN ('pending', 'approved', 'issued');

    IF v_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete item with active transactions';
    END IF;
END //
DELIMITER ;

-- Trigger: Log inventory changes (requires audit table)
-- CREATE TABLE inventory_audit (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     item_id INT,
--     action VARCHAR(20),
--     old_quantity INT,
--     new_quantity INT,
--     changed_by INT,
--     changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- ============================================================
-- INDEXES for Performance Optimization
-- ============================================================
-- Additional composite indexes for common query patterns

CREATE INDEX idx_items_status_dept ON inventory_items(status, department_id);
CREATE INDEX idx_items_status_category ON inventory_items(status, category_id);
CREATE INDEX idx_trans_status_type ON transactions(status, transaction_type);
CREATE INDEX idx_trans_user_status ON transactions(user_id, status);

-- ============================================================
-- NOTES
-- ============================================================
-- 1. Password hashing should use bcrypt or similar in the application layer
-- 2. JSON columns (borrowable_by, issuable_by) store arrays like: ["student", "faculty"]
-- 3. Remember to backup database regularly
-- 4. Run OPTIMIZE TABLE periodically for better performance
-- 5. Consider partitioning transactions table if data grows large
-- 6. Set up proper user permissions at MySQL level
-- 7. Enable binary logging for point-in-time recovery
-- 8. Use connection pooling in the application layer
-- ============================================================
