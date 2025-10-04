-- ============================================
-- KJSIT Inventory Management System
-- MySQL Sample Data
-- ============================================

-- Make sure to run schema.sql before running this file

-- ============================================
-- Insert Categories
-- ============================================
INSERT INTO categories (category_name) VALUES
('Electronics'),
('Computers'),
('Lab Equipment'),
('Furniture'),
('Stationery'),
('Sports Equipment'),
('Networking'),
('Software'),
('Chemicals'),
('Books');

-- ============================================
-- Insert Departments
-- ============================================
INSERT INTO departments (department_name, description) VALUES
('Computer Engineering', 'Department of Computer Engineering'),
('Information Technology', 'Department of Information Technology'),
('AI & Data Science', 'Department of Artificial Intelligence and Data Science'),
('Electronics & Telecommunication', 'Department of Electronics and Telecommunication Engineering'),
('Basic Sciences & Humanities', 'Department of Basic Sciences and Humanities'),
('Administration', 'College Administration and Management'),
('Student Facilities', 'Central student facilities and amenities');

-- ============================================
-- Insert Users
-- Note: In production, passwords should be hashed!
-- These are plain text for demo purposes only
-- ============================================
INSERT INTO users (username, password, full_name, email, role, department_id) VALUES
-- Admin Users
('admin', 'admin123', 'Admin User', 'admin@kjsit.edu.in', 'admin', 6),
('admin2', 'admin123', 'System Administrator', 'sysadmin@kjsit.edu.in', 'admin', 6),

-- Staff Users
('staff', 'staff123', 'Staff Member', 'staff@kjsit.edu.in', 'staff', 1),
('staff_comp', 'staff123', 'Computer Lab Staff', 'lab.comp@kjsit.edu.in', 'staff', 1),
('staff_it', 'staff123', 'IT Lab Staff', 'lab.it@kjsit.edu.in', 'staff', 2),
('staff_ai', 'staff123', 'AI Lab Staff', 'lab.ai@kjsit.edu.in', 'staff', 3),
('staff_extc', 'staff123', 'EXTC Lab Staff', 'lab.extc@kjsit.edu.in', 'staff', 4),
('staff_bsh', 'staff123', 'BSH Lab Staff', 'lab.bsh@kjsit.edu.in', 'staff', 5),

-- Student Users
('student', 'student123', 'John Doe', 'john.doe@somaiya.edu', 'student', 1),
('student2', 'student123', 'Jane Smith', 'jane.smith@somaiya.edu', 'student', 2),
('student3', 'student123', 'Raj Patel', 'raj.patel@somaiya.edu', 'student', 3),
('student4', 'student123', 'Priya Sharma', 'priya.sharma@somaiya.edu', 'student', 4),
('student5', 'student123', 'Amit Kumar', 'amit.kumar@somaiya.edu', 'student', 1);

-- ============================================
-- Insert Inventory Items - Computer Engineering
-- ============================================
INSERT INTO inventory_items (item_name, description, category_id, department_id, quantity, total_quantity, unit, created_by) VALUES
('Desktop Computer', 'High-performance desktop computers for lab - Intel i7, 16GB RAM, 512GB SSD', 2, 1, 50, 60, 'pcs', 1),
('Network Switch', '24-port Gigabit Ethernet switches for networking lab', 7, 1, 15, 20, 'pcs', 1),
('Arduino Kit', 'Arduino Uno R3 development kits with sensors and components', 1, 1, 30, 40, 'sets', 1),
('Raspberry Pi 4', 'Raspberry Pi 4 Model B 4GB RAM with accessories', 2, 1, 25, 30, 'pcs', 1),
('LAN Cables', 'Cat6 Ethernet cables 3m length', 7, 1, 200, 250, 'pcs', 1),
('USB Flash Drive', '32GB USB 3.0 flash drives for data transfer', 1, 1, 80, 100, 'pcs', 1),
('External Hard Drive', '1TB portable external hard drives', 2, 1, 20, 25, 'pcs', 1),
('Webcam', 'HD webcams for online classes and meetings', 1, 1, 15, 20, 'pcs', 1),
('Soldering Kit', 'Soldering iron with accessories for hardware projects', 3, 1, 25, 30, 'sets', 1),
('Breadboard', 'Electronic breadboards for prototyping', 1, 1, 50, 60, 'pcs', 1);

-- ============================================
-- Insert Inventory Items - Information Technology
-- ============================================
INSERT INTO inventory_items (item_name, description, category_id, department_id, quantity, total_quantity, unit, created_by) VALUES
('Laptop', 'Dell Latitude laptops - Intel i5, 8GB RAM, 256GB SSD', 2, 2, 40, 50, 'pcs', 1),
('Router', 'Enterprise-grade wireless routers for networking', 7, 2, 8, 10, 'pcs', 1),
('Network Simulator Software', 'Cisco Packet Tracer licenses for network simulation', 8, 2, 50, 50, 'licenses', 1),
('Projector', 'HD multimedia projectors for presentations', 1, 2, 10, 12, 'pcs', 1),
('HDMI Cables', 'HDMI cables 2m length for connectivity', 7, 2, 30, 40, 'pcs', 1),
('Wireless Mouse', 'Wireless optical mouse for computers', 2, 2, 60, 80, 'pcs', 1),
('Wireless Keyboard', 'Wireless keyboards for computer labs', 2, 2, 60, 80, 'pcs', 1),
('Network Cable Tester', 'Professional cable testers for IT lab', 7, 2, 5, 8, 'pcs', 1),
('Patch Panel', '24-port patch panels for network organization', 7, 2, 10, 12, 'pcs', 1),
('Portable Speaker', 'Bluetooth speakers for presentations', 1, 2, 15, 20, 'pcs', 1);

-- ============================================
-- Insert Inventory Items - AI & Data Science
-- ============================================
INSERT INTO inventory_items (item_name, description, category_id, department_id, quantity, total_quantity, unit, created_by) VALUES
('GPU Workstation', 'High-end workstations with NVIDIA RTX 3080 for ML/AI', 2, 3, 10, 12, 'pcs', 1),
('Machine Learning Software', 'TensorFlow and PyTorch professional licenses', 8, 3, 0, 30, 'licenses', 1),
('IoT Sensor Kit', 'Various IoT sensors - temperature, humidity, motion', 1, 3, 20, 25, 'sets', 1),
('Data Storage Server', '10TB NAS storage servers for big data', 2, 3, 5, 5, 'pcs', 1),
('Graphics Tablet', 'Wacom drawing tablets for data visualization', 1, 3, 15, 20, 'pcs', 1),
('AI Development Board', 'NVIDIA Jetson Nano development boards', 2, 3, 18, 25, 'pcs', 1),
('Python Books', 'Advanced Python programming reference books', 10, 3, 40, 50, 'pcs', 1),
('External GPU', 'External GPU enclosures for additional processing power', 2, 3, 8, 10, 'pcs', 1),
('Cloud Credits', 'AWS/Azure cloud service credits for students', 8, 3, 100, 100, 'credits', 1),
('Data Science Tools', 'Statistical analysis software licenses', 8, 3, 30, 30, 'licenses', 1);

-- ============================================
-- Insert Inventory Items - Electronics & Telecommunication
-- ============================================
INSERT INTO inventory_items (item_name, description, category_id, department_id, quantity, total_quantity, unit, created_by) VALUES
('Oscilloscope', 'Digital storage oscilloscopes 100MHz', 3, 4, 20, 25, 'pcs', 1),
('Signal Generator', 'Function/Arbitrary waveform generators', 3, 4, 15, 20, 'pcs', 1),
('Microcontroller Kit', '8051 microcontroller development kits', 1, 4, 35, 40, 'sets', 1),
('Multimeter', 'Digital multimeters for circuit testing', 3, 4, 40, 50, 'pcs', 1),
('Soldering Station', 'Temperature-controlled soldering stations', 3, 4, 25, 30, 'pcs', 1),
('Power Supply', 'Variable DC power supply units 0-30V', 3, 4, 20, 25, 'pcs', 1),
('Antenna Kit', 'Various antennas for telecommunication experiments', 1, 4, 15, 20, 'sets', 1),
('Circuit Boards', 'Printed circuit boards for prototyping', 3, 4, 100, 150, 'pcs', 1),
('Electronic Components', 'Resistors, capacitors, ICs assortment', 3, 4, 200, 250, 'sets', 1),
('Logic Analyzer', 'Digital logic analyzers for circuit debugging', 3, 4, 10, 12, 'pcs', 1),
('Spectrum Analyzer', 'RF spectrum analyzers for signal analysis', 3, 4, 8, 10, 'pcs', 1),
('Cable Connectors', 'Various cable connectors and adapters', 7, 4, 150, 200, 'pcs', 1);

-- ============================================
-- Insert Inventory Items - Basic Sciences & Humanities
-- ============================================
INSERT INTO inventory_items (item_name, description, category_id, department_id, quantity, total_quantity, unit, created_by) VALUES
('Microscope', 'Compound microscopes for biology lab 1000x magnification', 3, 5, 15, 20, 'pcs', 1),
('Beakers Set', 'Glass beakers various sizes 50ml to 1000ml', 3, 5, 50, 60, 'sets', 1),
('Chemistry Lab Chemicals', 'Various lab-grade chemicals for experiments', 9, 5, 0, 100, 'units', 1),
('Physics Lab Equipment', 'Lenses, prisms, and optical instruments', 3, 5, 30, 40, 'sets', 1),
('Vernier Caliper', 'Digital vernier calipers 0-150mm', 3, 5, 40, 50, 'pcs', 1),
('Test Tubes', 'Borosilicate glass test tubes with stands', 3, 5, 200, 250, 'pcs', 1),
('Burner', 'Bunsen burners for chemistry lab', 3, 5, 25, 30, 'pcs', 1),
('pH Meter', 'Digital pH meters for chemical analysis', 3, 5, 15, 20, 'pcs', 1),
('Weighing Balance', 'Digital weighing balance 0.001g precision', 3, 5, 12, 15, 'pcs', 1),
('Safety Goggles', 'Safety goggles for lab protection', 3, 5, 80, 100, 'pcs', 1),
('Lab Coats', 'White lab coats for students', 3, 5, 60, 80, 'pcs', 1),
('Thermometer', 'Digital thermometers for temperature measurement', 3, 5, 35, 40, 'pcs', 1);

-- ============================================
-- Insert Inventory Items - Administration
-- ============================================
INSERT INTO inventory_items (item_name, description, category_id, department_id, quantity, total_quantity, unit, created_by) VALUES
('Office Chair', 'Ergonomic office chairs with lumbar support', 4, 6, 80, 100, 'pcs', 1),
('Office Desk', 'Standard office desks 120x60cm', 4, 6, 70, 90, 'pcs', 1),
('Printer', 'Laser printers for office use', 1, 6, 20, 25, 'pcs', 1),
('Stationery Set', 'Pens, papers, staplers, clips office supplies', 5, 6, 150, 200, 'sets', 1),
('Filing Cabinet', 'Metal filing cabinets 4 drawer', 4, 6, 30, 40, 'pcs', 1),
('Whiteboard', 'Magnetic whiteboards 4x6 feet', 5, 6, 45, 60, 'pcs', 1),
('Marker Pens', 'Whiteboard marker pens assorted colors', 5, 6, 200, 300, 'pcs', 1),
('Paper Ream', 'A4 size paper reams 500 sheets', 5, 6, 100, 150, 'reams', 1),
('Printer Toner', 'Laser printer toner cartridges', 5, 6, 40, 60, 'pcs', 1),
('Laminator', 'Paper laminators for documents', 1, 6, 8, 10, 'pcs', 1);

-- ============================================
-- Insert Inventory Items - Student Facilities
-- ============================================
INSERT INTO inventory_items (item_name, description, category_id, department_id, quantity, total_quantity, unit, created_by) VALUES
('Library Books', 'Various academic and reference books', 10, 7, 5000, 6000, 'pcs', 1),
('Cricket Kit', 'Complete cricket kits with bats, balls, pads', 6, 7, 10, 15, 'sets', 1),
('Football', 'FIFA approved footballs size 5', 6, 7, 20, 25, 'pcs', 1),
('Student Laptop (Loanable)', 'Laptops available for student borrowing', 2, 7, 30, 50, 'pcs', 1),
('Calculator', 'Scientific calculators for students', 1, 7, 40, 60, 'pcs', 1),
('Volleyball', 'Standard volleyballs for sports', 6, 7, 15, 20, 'pcs', 1),
('Table Tennis Set', 'Table tennis paddles and balls', 6, 7, 20, 25, 'sets', 1),
('Chess Set', 'Chess boards with pieces', 6, 7, 15, 20, 'sets', 1),
('Projector Screen', 'Portable projector screens for events', 1, 7, 10, 15, 'pcs', 1),
('Audio Equipment', 'Microphones and speakers for events', 1, 7, 12, 15, 'sets', 1),
('Event Banners', 'Reusable event banners and stands', 5, 7, 20, 30, 'pcs', 1),
('Portable Whiteboard', 'Mobile whiteboards for study groups', 5, 7, 25, 30, 'pcs', 1);

-- ============================================
-- Insert Sample Transactions
-- ============================================
INSERT INTO transactions (item_id, user_id, quantity, status, reason, request_date, approved_date, approved_by) VALUES
-- Approved transactions
(34, 9, 1, 'approved', 'For final year project work', '2024-10-01', '2024-10-01', 3),
(45, 9, 1, 'approved', 'Sports day practice', '2024-09-28', '2024-09-28', 3),
(21, 10, 1, 'approved', 'Lab demonstration', '2024-10-02', '2024-10-02', 4),

-- Pending transactions
(35, 9, 2, 'pending', 'Mathematics assignment calculations', '2024-10-03', NULL, NULL),
(11, 11, 1, 'pending', 'AI project development', '2024-10-03', NULL, NULL),
(34, 12, 1, 'pending', 'Programming assignment', '2024-10-04', NULL, NULL),

-- Rejected transactions
(12, 9, 1, 'rejected', 'Testing purposes - reason not valid', '2024-09-25', '2024-09-26', 3),
(44, 10, 5, 'rejected', 'Quantity too high', '2024-09-27', '2024-09-28', 5),

-- Returned transactions
(30, 11, 2, 'returned', 'Workshop completed', '2024-09-20', '2024-09-20', 6),
(34, 13, 1, 'returned', 'Study purpose', '2024-09-15', '2024-09-15', 4);

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
