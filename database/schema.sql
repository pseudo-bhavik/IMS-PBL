-- ============================================
-- KJSIT Inventory Management System
-- MySQL Database Schema
-- ============================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS inventory_items;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS categories;

-- ============================================
-- Table: categories
-- Stores different categories of items
-- ============================================
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Table: departments
-- Stores different departments in KJSIT
-- ============================================
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Table: users
-- Stores user information for authentication
-- ============================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role ENUM('admin', 'staff', 'student') NOT NULL,
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Table: inventory_items
-- Stores all inventory items
-- ============================================
CREATE TABLE inventory_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    item_name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INT NOT NULL,
    department_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    total_quantity INT NOT NULL,
    unit VARCHAR(50) DEFAULT 'pcs',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_department (department_id),
    INDEX idx_quantity (quantity),
    CHECK (quantity >= 0),
    CHECK (total_quantity >= 0),
    CHECK (quantity <= total_quantity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Table: transactions
-- Stores all checkout/return transactions
-- ============================================
CREATE TABLE transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL,
    user_id INT NOT NULL,
    quantity INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'returned') NOT NULL DEFAULT 'pending',
    reason TEXT,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_date TIMESTAMP NULL,
    return_date TIMESTAMP NULL,
    approved_by INT,
    remarks TEXT,
    FOREIGN KEY (item_id) REFERENCES inventory_items(item_id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_user (user_id),
    INDEX idx_item (item_id),
    INDEX idx_request_date (request_date),
    CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Create Views for Easy Querying
-- ============================================

-- View: inventory_with_status
-- Shows inventory items with their current status
CREATE VIEW inventory_with_status AS
SELECT
    i.item_id,
    i.item_name,
    i.description,
    c.category_name,
    d.department_name,
    i.quantity,
    i.total_quantity,
    i.unit,
    CASE
        WHEN i.quantity = 0 THEN 'Out of Stock'
        WHEN i.quantity <= (i.total_quantity * 0.2) THEN 'Low Stock'
        ELSE 'Available'
    END AS status,
    i.created_at,
    i.updated_at
FROM inventory_items i
JOIN categories c ON i.category_id = c.category_id
JOIN departments d ON i.department_id = d.department_id;

-- View: transaction_details
-- Shows detailed transaction information
CREATE VIEW transaction_details AS
SELECT
    t.transaction_id,
    t.item_id,
    i.item_name,
    c.category_name,
    d.department_name,
    t.user_id,
    u.full_name AS user_name,
    u.role AS user_role,
    t.quantity,
    t.status,
    t.reason,
    t.request_date,
    t.approved_date,
    t.return_date,
    a.full_name AS approved_by_name,
    t.remarks
FROM transactions t
JOIN inventory_items i ON t.item_id = i.item_id
JOIN categories c ON i.category_id = c.category_id
JOIN departments d ON i.department_id = d.department_id
JOIN users u ON t.user_id = u.user_id
LEFT JOIN users a ON t.approved_by = a.user_id;

-- View: low_stock_items
-- Shows items that are low or out of stock
CREATE VIEW low_stock_items AS
SELECT
    i.item_id,
    i.item_name,
    c.category_name,
    d.department_name,
    i.quantity,
    i.total_quantity,
    CASE
        WHEN i.quantity = 0 THEN 'Out of Stock'
        ELSE 'Low Stock'
    END AS status
FROM inventory_items i
JOIN categories c ON i.category_id = c.category_id
JOIN departments d ON i.department_id = d.department_id
WHERE i.quantity <= (i.total_quantity * 0.2);

-- ============================================
-- Create Triggers
-- ============================================

-- Trigger: Update quantity after transaction approval
DELIMITER //

CREATE TRIGGER after_transaction_approval
AFTER UPDATE ON transactions
FOR EACH ROW
BEGIN
    IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
        UPDATE inventory_items
        SET quantity = quantity - NEW.quantity
        WHERE item_id = NEW.item_id;
    END IF;
END//

CREATE TRIGGER after_transaction_return
AFTER UPDATE ON transactions
FOR EACH ROW
BEGIN
    IF NEW.status = 'returned' AND OLD.status = 'approved' THEN
        UPDATE inventory_items
        SET quantity = quantity + NEW.quantity
        WHERE item_id = NEW.item_id;
    END IF;
END//

DELIMITER ;

-- ============================================
-- Create Stored Procedures
-- ============================================

-- Procedure: Get dashboard statistics
DELIMITER //

CREATE PROCEDURE get_dashboard_stats(IN user_role VARCHAR(20), IN user_id INT)
BEGIN
    IF user_role = 'admin' THEN
        SELECT
            (SELECT SUM(total_quantity) FROM inventory_items) AS total_items,
            (SELECT SUM(quantity) FROM inventory_items) AS available_items,
            (SELECT COUNT(*) FROM inventory_items WHERE quantity <= (total_quantity * 0.2)) AS low_stock_items,
            (SELECT COUNT(*) FROM transactions WHERE status = 'pending') AS pending_requests,
            (SELECT COUNT(*) FROM departments) AS total_departments,
            (SELECT COUNT(*) FROM categories) AS total_categories;
    ELSEIF user_role = 'staff' THEN
        SELECT
            (SELECT COUNT(*) FROM transactions WHERE status = 'pending') AS pending_requests,
            (SELECT COUNT(*) FROM transactions WHERE status = 'approved' AND DATE(approved_date) = CURDATE()) AS approved_today,
            (SELECT COUNT(*) FROM inventory_items WHERE quantity <= (total_quantity * 0.2)) AS low_stock_items,
            (SELECT COUNT(*) FROM inventory_items) AS total_items;
    ELSEIF user_role = 'student' THEN
        SELECT
            (SELECT COUNT(*) FROM transactions WHERE user_id = user_id AND status = 'pending') AS my_pending,
            (SELECT COUNT(*) FROM transactions WHERE user_id = user_id AND status = 'approved') AS my_approved,
            (SELECT COUNT(*) FROM inventory_items WHERE quantity > 0) AS available_items,
            (SELECT COUNT(*) FROM inventory_items) AS total_items;
    END IF;
END//

-- Procedure: Get pending requests
CREATE PROCEDURE get_pending_requests()
BEGIN
    SELECT * FROM transaction_details
    WHERE status = 'pending'
    ORDER BY request_date DESC;
END//

-- Procedure: Approve transaction
CREATE PROCEDURE approve_transaction(
    IN trans_id INT,
    IN approver_id INT
)
BEGIN
    DECLARE item_qty INT;
    DECLARE trans_qty INT;
    DECLARE item_id_val INT;

    -- Get transaction details
    SELECT item_id, quantity INTO item_id_val, trans_qty
    FROM transactions
    WHERE transaction_id = trans_id;

    -- Get current item quantity
    SELECT quantity INTO item_qty
    FROM inventory_items
    WHERE item_id = item_id_val;

    -- Check if enough quantity available
    IF item_qty >= trans_qty THEN
        UPDATE transactions
        SET status = 'approved',
            approved_date = CURRENT_TIMESTAMP,
            approved_by = approver_id
        WHERE transaction_id = trans_id;

        SELECT 'success' AS result, 'Transaction approved successfully' AS message;
    ELSE
        SELECT 'error' AS result, 'Not enough quantity available' AS message;
    END IF;
END//

-- Procedure: Reject transaction
CREATE PROCEDURE reject_transaction(
    IN trans_id INT,
    IN approver_id INT,
    IN reject_reason TEXT
)
BEGIN
    UPDATE transactions
    SET status = 'rejected',
        approved_date = CURRENT_TIMESTAMP,
        approved_by = approver_id,
        remarks = reject_reason
    WHERE transaction_id = trans_id;

    SELECT 'success' AS result, 'Transaction rejected' AS message;
END//

DELIMITER ;

-- ============================================
-- Grant Permissions (Optional)
-- Uncomment if you need to create specific users
-- ============================================

-- CREATE USER IF NOT EXISTS 'kjsit_admin'@'localhost' IDENTIFIED BY 'admin_password';
-- GRANT ALL PRIVILEGES ON kjsit_inventory.* TO 'kjsit_admin'@'localhost';

-- CREATE USER IF NOT EXISTS 'kjsit_staff'@'localhost' IDENTIFIED BY 'staff_password';
-- GRANT SELECT, INSERT, UPDATE ON kjsit_inventory.* TO 'kjsit_staff'@'localhost';

-- CREATE USER IF NOT EXISTS 'kjsit_student'@'localhost' IDENTIFIED BY 'student_password';
-- GRANT SELECT ON kjsit_inventory.inventory_items TO 'kjsit_student'@'localhost';
-- GRANT SELECT, INSERT ON kjsit_inventory.transactions TO 'kjsit_student'@'localhost';

-- FLUSH PRIVILEGES;

-- ============================================
-- End of Schema
-- ============================================
