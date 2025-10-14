-- ============================================
-- KJSIT Inventory Management System
-- MySQL Sample Data
-- ============================================

-- Make sure to run kjsit_inventory_mysql_schema.sql before running this file

-- Note: Sample categories and departments are already included in the main schema file
-- This file contains ADDITIONAL sample inventory items

-- ============================================
-- ADDITIONAL Inventory Items - Computer Engineering
-- ============================================
INSERT INTO inventory_items (name, description, category_id, department_id, quantity, total_quantity, unit, is_borrowable, is_issuable, borrowable_by, issuable_by, status, created_by) VALUES
('HDMI to VGA Adapter', 'HDMI to VGA conversion adapters for displays', 1, 1, 45, 50, 'pcs', TRUE, FALSE, '["student", "faculty"]', '[]', 'approved', 2),
('Mechanical Keyboard', 'RGB mechanical gaming keyboards for programming labs', 2, 1, 35, 40, 'pcs', TRUE, FALSE, '["student"]', '[]', 'approved', 2),
('Monitor 24 inch', 'Full HD 24-inch LED monitors', 2, 1, 50, 60, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 2),
('Graphics Card GTX 1660', 'NVIDIA GTX 1660 graphics cards for ML projects', 2, 1, 8, 10, 'pcs', TRUE, FALSE, '["faculty"]', '[]', 'approved', 2),
('SSD 512GB', 'NVMe SSD 512GB for system upgrades', 2, 1, 20, 25, 'pcs', FALSE, TRUE, '[]', '["faculty"]', 'approved', 2),
('RAM DDR4 16GB', '16GB DDR4 RAM modules 3200MHz', 2, 1, 30, 40, 'pcs', FALSE, TRUE, '[]', '["faculty"]', 'approved', 2),
('Cooling Fan CPU', 'CPU cooling fans for desktop systems', 1, 1, 25, 30, 'pcs', FALSE, TRUE, '[]', '["staff", "faculty"]', 'approved', 2),
('Power Supply 650W', '650W modular power supply units', 2, 1, 15, 20, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 2);

-- ============================================
-- ADDITIONAL Inventory Items - Information Technology
-- ============================================
INSERT INTO inventory_items (name, description, category_id, department_id, quantity, total_quantity, unit, is_borrowable, is_issuable, borrowable_by, issuable_by, status, created_by) VALUES
('USB Hub 7-Port', '7-port USB 3.0 hubs with power adapter', 7, 2, 40, 50, 'pcs', TRUE, FALSE, '["student", "faculty"]', '[]', 'approved', 3),
('Ethernet Crimping Tool', 'RJ45 crimping tools with cable tester', 7, 2, 12, 15, 'pcs', TRUE, FALSE, '["student"]', '[]', 'approved', 3),
('Fiber Optic Cable', 'Single-mode fiber optic cables 10m', 7, 2, 50, 60, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 3),
('Managed Switch 48-Port', '48-port managed gigabit switches', 7, 2, 6, 8, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 3),
('Server Rack 42U', '42U server racks with cooling', 7, 2, 3, 5, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 3),
('UPS 2KVA', 'Uninterruptible power supply 2KVA', 1, 2, 10, 15, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 3),
('KVM Switch 8-Port', '8-port KVM switches for server management', 7, 2, 8, 10, 'pcs', TRUE, FALSE, '["faculty", "staff"]', '[]', 'approved', 3),
('Thunderbolt Cable', 'Thunderbolt 3 cables 1m length', 7, 2, 25, 30, 'pcs', TRUE, FALSE, '["student", "faculty"]', '[]', 'approved', 3);

-- ============================================
-- ADDITIONAL Inventory Items - AI & Data Science
-- ============================================
INSERT INTO inventory_items (name, description, category_id, department_id, quantity, total_quantity, unit, is_borrowable, is_issuable, borrowable_by, issuable_by, status, created_by) VALUES
('TPU Development Kit', 'Google Coral TPU development boards', 2, 3, 10, 15, 'pcs', TRUE, FALSE, '["faculty"]', '[]', 'approved', 4),
('CUDA Programming Books', 'CUDA programming and GPU computing books', 10, 3, 20, 25, 'pcs', TRUE, FALSE, '["student", "faculty"]', '[]', 'approved', 4),
('Smart Home IoT Kit', 'Complete smart home IoT development kit', 1, 3, 15, 20, 'sets', TRUE, FALSE, '["student"]', '[]', 'approved', 4),
('Deep Learning Workstation', 'Dual RTX 4090 workstations for deep learning', 2, 3, 5, 6, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 4),
('Data Annotation Tool License', 'LabelBox professional licenses for data annotation', 8, 3, 25, 30, 'licenses', FALSE, TRUE, '[]', '["student", "faculty"]', 'approved', 4),
('Webcam HD Conference', '4K webcams for video conferencing', 1, 3, 18, 20, 'pcs', TRUE, FALSE, '["faculty", "staff"]', '[]', 'approved', 4),
('Edge Computing Device', 'Intel Neural Compute Stick for edge AI', 2, 3, 12, 15, 'pcs', TRUE, FALSE, '["student", "faculty"]', '[]', 'approved', 4),
('Kaggle Competition Credits', 'Credits for Kaggle competitions and datasets', 8, 3, 50, 50, 'credits', FALSE, TRUE, '[]', '["student"]', 'approved', 4);

-- ============================================
-- ADDITIONAL Inventory Items - Electronics & Telecommunication
-- ============================================
INSERT INTO inventory_items (name, description, category_id, department_id, quantity, total_quantity, unit, is_borrowable, is_issuable, borrowable_by, issuable_by, status, created_by) VALUES
('FPGA Development Board', 'Xilinx Spartan-6 FPGA development boards', 3, 4, 18, 25, 'pcs', TRUE, FALSE, '["student", "faculty"]', '[]', 'approved', 5),
('RF Signal Generator', 'Radio frequency signal generators up to 6GHz', 3, 4, 10, 12, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 5),
('PCB Prototyping Machine', 'PCB milling machine for circuit board prototyping', 3, 4, 2, 3, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 5),
('ESP32 Development Kit', 'ESP32 WiFi+BT microcontroller kits', 1, 4, 50, 60, 'sets', TRUE, FALSE, '["student"]', '[]', 'approved', 5),
('Antenna Analyzer', 'Professional antenna analyzers for RF testing', 3, 4, 8, 10, 'pcs', TRUE, FALSE, '["faculty"]', '[]', 'approved', 5),
('DC Motor Driver Module', 'L298N motor driver modules', 3, 4, 60, 80, 'pcs', TRUE, FALSE, '["student"]', '[]', 'approved', 5),
('Voltage Regulator IC', 'LM7805 voltage regulator ICs', 3, 4, 150, 200, 'pcs', TRUE, FALSE, '["student", "faculty"]', '[]', 'approved', 5),
('RF Cables Assorted', 'Various RF coaxial cables and connectors', 7, 4, 100, 120, 'pcs', TRUE, FALSE, '["student", "faculty"]', '[]', 'approved', 5);

-- ============================================
-- ADDITIONAL Inventory Items - Basic Sciences & Humanities
-- ============================================
INSERT INTO inventory_items (name, description, category_id, department_id, quantity, total_quantity, unit, is_borrowable, is_issuable, borrowable_by, issuable_by, status, created_by) VALUES
('Spectrophotometer', 'UV-VIS spectrophotometer for chemical analysis', 3, 5, 5, 6, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 6),
('Centrifuge Machine', 'Laboratory centrifuge 6000 RPM', 3, 5, 8, 10, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 6),
('Hot Plate Magnetic Stirrer', 'Hot plate with magnetic stirrer for chemistry', 3, 5, 20, 25, 'pcs', TRUE, FALSE, '["faculty"]', '[]', 'approved', 6),
('Pipette Set', 'Micropipettes 10-1000ul with tips', 3, 5, 30, 40, 'sets', TRUE, FALSE, '["student", "faculty"]', '[]', 'approved', 6),
('Fume Hood', 'Chemical fume hoods for safe experiments', 3, 5, 4, 5, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 6),
('Autoclave', 'Laboratory autoclaves for sterilization', 3, 5, 3, 4, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 6),
('Physics Experiment Kits', 'Mechanics and optics experiment kits', 3, 5, 35, 40, 'sets', TRUE, FALSE, '["student"]', '[]', 'approved', 6),
('Mathematical Instruments', 'Compass, protractor, rulers geometry sets', 5, 5, 80, 100, 'sets', TRUE, FALSE, '["student"]', '[]', 'approved', 6);

-- ============================================
-- ADDITIONAL Inventory Items - Administration
-- ============================================
INSERT INTO inventory_items (name, description, category_id, department_id, quantity, total_quantity, unit, is_borrowable, is_issuable, borrowable_by, issuable_by, status, created_by) VALUES
('Ergonomic Mouse Pad', 'Wrist rest ergonomic mouse pads', 5, 6, 90, 120, 'pcs', TRUE, FALSE, '["staff", "faculty"]', '[]', 'approved', 1),
('Document Scanner', 'High-speed document scanners', 1, 6, 12, 15, 'pcs', TRUE, FALSE, '["staff", "faculty"]', '[]', 'approved', 1),
('Paper Shredder', 'Cross-cut paper shredders for secure disposal', 1, 6, 15, 20, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 1),
('Conference Phone', 'Polycom conference phones for meetings', 1, 6, 10, 12, 'pcs', TRUE, FALSE, '["staff", "faculty"]', '[]', 'approved', 1),
('Notice Board Cork', 'Cork notice boards 4x3 feet', 5, 6, 40, 50, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 1),
('Attendance Biometric', 'Fingerprint biometric attendance machines', 1, 6, 8, 10, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 1),
('Water Dispenser', 'Hot and cold water dispensers', 4, 6, 15, 20, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 1),
('Desk Organizer', 'Multi-compartment desk organizers', 5, 6, 100, 130, 'pcs', TRUE, FALSE, '["staff", "faculty"]', '[]', 'approved', 1);

-- ============================================
-- ADDITIONAL Inventory Items - Student Facilities
-- ============================================
INSERT INTO inventory_items (name, description, category_id, department_id, quantity, total_quantity, unit, is_borrowable, is_issuable, borrowable_by, issuable_by, status, created_by) VALUES
('Badminton Racket', 'Professional badminton rackets with shuttlecocks', 6, 7, 30, 40, 'sets', TRUE, FALSE, '["student"]', '[]', 'approved', 1),
('Basketball', 'Spalding basketballs size 7', 6, 7, 18, 25, 'pcs', TRUE, FALSE, '["student"]', '[]', 'approved', 1),
('Carrom Board', 'Professional carrom boards with coins and striker', 6, 7, 12, 15, 'sets', TRUE, FALSE, '["student"]', '[]', 'approved', 1),
('Photography Camera DSLR', 'Canon EOS DSLR cameras for events', 1, 7, 5, 8, 'pcs', TRUE, FALSE, '["student", "faculty"]', '[]', 'approved', 1),
('Tripod Stand', 'Professional camera tripod stands', 1, 7, 10, 15, 'pcs', TRUE, FALSE, '["student", "faculty"]', '[]', 'approved', 1),
('Portable PA System', 'Portable public address systems for events', 1, 7, 8, 10, 'sets', TRUE, FALSE, '["student"]', '[]', 'approved', 1),
('Study Table Foldable', 'Foldable study tables for group study', 4, 7, 50, 60, 'pcs', TRUE, FALSE, '["student"]', '[]', 'approved', 1),
('Book Stand Reading', 'Adjustable book stands for reading', 5, 7, 80, 100, 'pcs', TRUE, FALSE, '["student"]', '[]', 'approved', 1),
('Charging Station Multi-Port', '10-port USB charging stations', 1, 7, 25, 30, 'pcs', FALSE, FALSE, '[]', '[]', 'approved', 1),
('Locker Storage', 'Personal lockers for student storage', 4, 7, 200, 250, 'pcs', FALSE, TRUE, '[]', '["student"]', 'approved', 1);

-- ============================================
-- Sample Transactions - You can add these after setting up users
-- ============================================
-- Note: Transaction insertion requires existing item_id and user_id values
-- These should be added AFTER you have populated users and items
-- Uncomment and modify the IDs below based on your actual data:

-- INSERT INTO transactions (item_id, user_id, quantity, status, transaction_type, reason, request_date, approved_date, approved_by) VALUES
-- (1, 9, 1, 'approved', 'borrow', 'For final year project work', '2024-10-01', '2024-10-01', 1),
-- (2, 10, 2, 'pending', 'borrow', 'Lab experiment requirements', '2024-10-08', NULL, NULL),
-- (3, 11, 1, 'approved', 'issue', 'Permanent allocation for research', '2024-10-05', '2024-10-05', 1);

-- ============================================
-- Display Summary
-- ============================================
SELECT 'Database populated successfully!' AS Status;

SELECT
    'Categories' AS Table_Name,
    COUNT(*) AS Record_Count
FROM categories
UNION ALL
SELECT 'Departments', COUNT(*) FROM departments
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Inventory Items', COUNT(*) FROM inventory_items
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions;

-- Show low stock items
SELECT 'Low Stock Alert' AS Alert_Type;
SELECT * FROM low_stock_items;

-- ============================================
-- End of Data Insertion
-- ============================================
