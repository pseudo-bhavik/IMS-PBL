// Mock Data for KJSIT Inventory Management System

// Categories and Departments are now loaded from backend API
// These declarations have been moved to individual page files that need them

// Users (for demo login)
const USERS = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User', departmentId: 6 },
    { id: 2, username: 'staff', password: 'staff123', role: 'staff', name: 'Staff Member', departmentId: 1 },
    { id: 3, username: 'faculty', password: 'faculty123', role: 'faculty', name: 'Dr. Jane Smith', departmentId: 1 },
    { id: 4, username: 'student', password: 'student123', role: 'student', name: 'John Doe', departmentId: 1 }
];

// Inventory Items
const INVENTORY_ITEMS = [
    // Computer Engineering
    { id: 1, name: 'Desktop Computer', categoryId: 2, departmentId: 1, quantity: 50, totalQuantity: 60, description: 'High-performance desktop computers for lab', isBorrowable: true, isIssuable: false, borrowableBy: ['faculty'], issuableBy: [], status: 'approved', createdBy: 1 },
    { id: 2, name: 'Network Switch', categoryId: 7, departmentId: 1, quantity: 15, totalQuantity: 20, description: '24-port Gigabit Ethernet switches', isBorrowable: true, isIssuable: false, borrowableBy: ['faculty'], issuableBy: [], status: 'approved', createdBy: 1 },
    { id: 3, name: 'Arduino Kit', categoryId: 1, departmentId: 1, quantity: 30, totalQuantity: 40, description: 'Arduino Uno development kits', isBorrowable: true, isIssuable: true, borrowableBy: ['student', 'faculty'], issuableBy: ['student', 'faculty'], status: 'approved', createdBy: 1 },
    { id: 4, name: 'Raspberry Pi 4', categoryId: 2, departmentId: 1, quantity: 25, totalQuantity: 30, description: 'Raspberry Pi 4 Model B 4GB RAM', isBorrowable: true, isIssuable: true, borrowableBy: ['student', 'faculty'], issuableBy: ['student', 'faculty'], status: 'approved', createdBy: 1 },
    { id: 5, name: 'LAN Cables', categoryId: 7, departmentId: 1, quantity: 200, totalQuantity: 250, description: 'Cat6 Ethernet cables', isBorrowable: true, isIssuable: false, borrowableBy: ['faculty'], issuableBy: [], status: 'approved', createdBy: 1 },

    // Information Technology
    { id: 6, name: 'Laptop', categoryId: 2, departmentId: 2, quantity: 40, totalQuantity: 50, description: 'Dell Latitude laptops for students', isBorrowable: true, isIssuable: true, borrowableBy: ['student', 'faculty'], issuableBy: ['student', 'faculty'], status: 'approved', createdBy: 1 },
    { id: 7, name: 'Router', categoryId: 7, departmentId: 2, quantity: 8, totalQuantity: 10, description: 'Enterprise-grade routers', isBorrowable: true, isIssuable: false, borrowableBy: ['faculty'], issuableBy: [], status: 'approved', createdBy: 1 },
    { id: 8, name: 'Network Simulator Software', categoryId: 8, departmentId: 2, quantity: 50, totalQuantity: 50, description: 'Cisco Packet Tracer licenses', isBorrowable: false, isIssuable: true, borrowableBy: [], issuableBy: ['student', 'faculty'], status: 'pending', createdBy: 2 },
    { id: 9, name: 'Projector', categoryId: 1, departmentId: 2, quantity: 10, totalQuantity: 12, description: 'HD multimedia projectors', isBorrowable: true, isIssuable: false, borrowableBy: ['faculty'], issuableBy: [], status: 'approved', createdBy: 1 },

    // AI & Data Science
    { id: 10, name: 'GPU Workstation', categoryId: 2, departmentId: 3, quantity: 10, totalQuantity: 12, description: 'NVIDIA RTX 3080 workstations', isBorrowable: false, isIssuable: true, borrowableBy: [], issuableBy: ['faculty'], status: 'approved', createdBy: 1 },
    { id: 11, name: 'Machine Learning Software', categoryId: 8, departmentId: 3, quantity: 0, totalQuantity: 30, description: 'TensorFlow and PyTorch licenses', isBorrowable: false, isIssuable: true, borrowableBy: [], issuableBy: ['student', 'faculty'], status: 'approved', createdBy: 1 },
    { id: 12, name: 'IoT Sensor Kit', categoryId: 1, departmentId: 3, quantity: 20, totalQuantity: 25, description: 'Various IoT sensors for projects', isBorrowable: true, isIssuable: true, borrowableBy: ['student', 'faculty'], issuableBy: ['student', 'faculty'], status: 'approved', createdBy: 1 },
    { id: 13, name: 'Data Storage Server', categoryId: 2, departmentId: 3, quantity: 5, totalQuantity: 5, description: '10TB NAS storage servers', isBorrowable: false, isIssuable: false, borrowableBy: [], issuableBy: [], status: 'approved', createdBy: 1 },

    // Electronics & Telecommunication
    { id: 14, name: 'Oscilloscope', categoryId: 3, departmentId: 4, quantity: 20, totalQuantity: 25, description: 'Digital storage oscilloscopes', isBorrowable: true, isIssuable: false, borrowableBy: ['student', 'faculty'], issuableBy: [], status: 'approved', createdBy: 1 },
    { id: 15, name: 'Signal Generator', categoryId: 3, departmentId: 4, quantity: 15, totalQuantity: 20, description: 'Function/Arbitrary waveform generators', isBorrowable: true, isIssuable: false, borrowableBy: ['student', 'faculty'], issuableBy: [], status: 'approved', createdBy: 1 },
    { id: 16, name: 'Microcontroller Kit', categoryId: 1, departmentId: 4, quantity: 35, totalQuantity: 40, description: '8051 microcontroller kits', isBorrowable: true, isIssuable: true, borrowableBy: ['student', 'faculty'], issuableBy: ['student', 'faculty'], status: 'approved', createdBy: 1 },
    { id: 17, name: 'Multimeter', categoryId: 3, departmentId: 4, quantity: 40, totalQuantity: 50, description: 'Digital multimeters', isBorrowable: true, isIssuable: false, borrowableBy: ['student', 'faculty'], issuableBy: [], status: 'approved', createdBy: 1 },
    { id: 18, name: 'Soldering Station', categoryId: 3, departmentId: 4, quantity: 25, totalQuantity: 30, description: 'Temperature-controlled soldering stations', isBorrowable: true, isIssuable: false, borrowableBy: ['faculty'], issuableBy: [], status: 'approved', createdBy: 1 },

    // Basic Sciences & Humanities
    { id: 19, name: 'Microscope', categoryId: 3, departmentId: 5, quantity: 15, totalQuantity: 20, description: 'Compound microscopes for biology lab', isBorrowable: true, isIssuable: false, borrowableBy: ['faculty'], issuableBy: [], status: 'approved', createdBy: 1 },
    { id: 20, name: 'Beakers Set', categoryId: 3, departmentId: 5, quantity: 50, totalQuantity: 60, description: 'Glass beakers various sizes', isBorrowable: true, isIssuable: false, borrowableBy: ['faculty'], issuableBy: [], status: 'approved', createdBy: 1 },
    { id: 21, name: 'Chemistry Lab Chemicals', categoryId: 9, departmentId: 5, quantity: 0, totalQuantity: 100, description: 'Various lab-grade chemicals', isBorrowable: true, isIssuable: false, borrowableBy: ['faculty'], issuableBy: [], status: 'approved', createdBy: 1 },
    { id: 22, name: 'Physics Lab Equipment', categoryId: 3, departmentId: 5, quantity: 30, totalQuantity: 40, description: 'Lenses, prisms, and optical instruments', isBorrowable: true, isIssuable: false, borrowableBy: ['faculty'], issuableBy: [], status: 'approved', createdBy: 1 },
    { id: 23, name: 'Vernier Caliper', categoryId: 3, departmentId: 5, quantity: 40, totalQuantity: 50, description: 'Digital vernier calipers', isBorrowable: true, isIssuable: true, borrowableBy: ['student', 'faculty'], issuableBy: ['student', 'faculty'], status: 'approved', createdBy: 1 },

    // Administration
    { id: 24, name: 'Office Chair', categoryId: 4, departmentId: 6, quantity: 80, totalQuantity: 100, description: 'Ergonomic office chairs', isBorrowable: false, isIssuable: false, borrowableBy: [], issuableBy: [], status: 'approved', createdBy: 1 },
    { id: 25, name: 'Office Desk', categoryId: 4, departmentId: 6, quantity: 70, totalQuantity: 90, description: 'Standard office desks', isBorrowable: false, isIssuable: false, borrowableBy: [], issuableBy: [], status: 'approved', createdBy: 1 },
    { id: 26, name: 'Printer', categoryId: 1, departmentId: 6, quantity: 20, totalQuantity: 25, description: 'Laser printers', isBorrowable: false, isIssuable: true, borrowableBy: [], issuableBy: ['faculty'], status: 'approved', createdBy: 1 },
    { id: 27, name: 'Stationery Set', categoryId: 5, departmentId: 6, quantity: 150, totalQuantity: 200, description: 'Pens, papers, staplers, etc.', isBorrowable: true, isIssuable: false, borrowableBy: ['faculty'], issuableBy: [], status: 'approved', createdBy: 1 },

    // Student Facilities
    { id: 28, name: 'Library Books', categoryId: 10, departmentId: 7, quantity: 5000, totalQuantity: 6000, description: 'Various academic and reference books', isBorrowable: true, isIssuable: false, borrowableBy: ['student', 'faculty'], issuableBy: [], status: 'approved', createdBy: 1 },
    { id: 29, name: 'Cricket Kit', categoryId: 6, departmentId: 7, quantity: 10, totalQuantity: 15, description: 'Complete cricket kits with bats and balls', isBorrowable: true, isIssuable: true, borrowableBy: ['student'], issuableBy: ['student'], status: 'approved', createdBy: 1 },
    { id: 30, name: 'Football', categoryId: 6, departmentId: 7, quantity: 20, totalQuantity: 25, description: 'FIFA approved footballs', isBorrowable: true, isIssuable: false, borrowableBy: ['student'], issuableBy: [], status: 'approved', createdBy: 1 },
    { id: 31, name: 'Student Laptop (Loanable)', categoryId: 2, departmentId: 7, quantity: 30, totalQuantity: 50, description: 'Laptops available for student borrowing', isBorrowable: true, isIssuable: true, borrowableBy: ['student', 'faculty'], issuableBy: ['student'], status: 'approved', createdBy: 1 },
    { id: 32, name: 'Calculator', categoryId: 1, departmentId: 7, quantity: 40, totalQuantity: 60, description: 'Scientific calculators', isBorrowable: true, isIssuable: true, borrowableBy: ['student', 'faculty'], issuableBy: ['student', 'faculty'], status: 'approved', createdBy: 1 }
];

// Transactions
const TRANSACTIONS = [
    { id: 1, itemId: 31, userId: 4, quantity: 1, status: 'approved', transactionType: 'borrow', requestDate: '2024-10-01', approvedDate: '2024-10-01', reason: 'For project work' },
    { id: 2, itemId: 32, userId: 4, quantity: 2, status: 'pending', transactionType: 'borrow', requestDate: '2024-10-03', approvedDate: null, reason: 'Math assignment' },
    { id: 3, itemId: 29, userId: 3, quantity: 1, status: 'approved', transactionType: 'issue', requestDate: '2024-09-28', approvedDate: '2024-09-28', reason: 'Sports day equipment' },
    { id: 4, itemId: 6, userId: 4, quantity: 1, status: 'rejected', transactionType: 'borrow', requestDate: '2024-09-25', approvedDate: '2024-09-26', reason: 'Testing purposes' },
    { id: 5, itemId: 10, userId: 3, quantity: 1, status: 'issued', transactionType: 'issue', requestDate: '2024-10-02', approvedDate: '2024-10-02', reason: 'Research work' },
    { id: 6, itemId: 14, userId: 2, quantity: 2, status: 'returned', transactionType: 'borrow', requestDate: '2024-09-20', approvedDate: '2024-09-20', reason: 'Workshop' },
    { id: 7, itemId: 3, userId: 4, quantity: 3, status: 'approved', transactionType: 'borrow', requestDate: '2024-10-04', approvedDate: '2024-10-04', reason: 'Electronics project' },
    { id: 8, itemId: 16, userId: 4, quantity: 1, status: 'issued', transactionType: 'issue', requestDate: '2024-10-03', approvedDate: '2024-10-03', reason: 'Final year project' },
    { id: 9, itemId: 28, userId: 4, quantity: 5, status: 'approved', transactionType: 'borrow', requestDate: '2024-09-30', approvedDate: '2024-09-30', reason: 'Study material' },
    { id: 10, itemId: 12, userId: 3, quantity: 2, status: 'pending', transactionType: 'issue', requestDate: '2024-10-04', approvedDate: null, reason: 'Research project' }
];

// Damage Reports
const DAMAGE_REPORTS = [
    { id: 1, itemId: 1, reportedBy: 4, type: 'damage', severity: 'minor', description: 'Screen has small crack in bottom corner', estimatedCost: 5000, status: 'under_review', reportedAt: '2024-10-02' },
    { id: 2, itemId: 14, reportedBy: 2, type: 'damage', severity: 'major', description: 'Probe cable completely broken', estimatedCost: 15000, status: 'repair_in_progress', reportedAt: '2024-09-30', assignedTo: 2 },
    { id: 3, itemId: 32, reportedBy: 4, type: 'loss', severity: 'total_loss', description: 'Calculator lost during lab session', estimatedCost: 1500, status: 'reported', reportedAt: '2024-10-03' }
];

// Issued Items
const ISSUED_ITEMS = [
    { id: 1, transactionId: 5, itemId: 10, issuedTo: 3, issuedBy: 1, quantity: 1, issueDate: '2024-10-02', status: 'active', notes: 'For semester research project' },
    { id: 2, transactionId: 3, itemId: 29, issuedTo: 3, issuedBy: 1, quantity: 1, issueDate: '2024-09-28', status: 'active', notes: 'For sports coordinator duties' }
];

// Store current user in session
function setCurrentUser(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}

function getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Check if user is logged in
function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

// Get category name by id
function getCategoryName(categoryId) {
    if (typeof CATEGORIES !== 'undefined' && CATEGORIES) {
        const category = CATEGORIES.find(c => c.id === categoryId);
        return category ? category.name : 'Unknown';
    }
    return 'Unknown';
}

// Get department name by id
function getDepartmentName(departmentId) {
    if (typeof DEPARTMENTS !== 'undefined' && DEPARTMENTS) {
        const department = DEPARTMENTS.find(d => d.id === departmentId);
        return department ? department.name : 'Unknown';
    }
    return 'Unknown';
}

// Get item by id
function getItemById(itemId) {
    return INVENTORY_ITEMS.find(item => item.id === itemId);
}

// Get user by id
function getUserById(userId) {
    return USERS.find(u => u.id === userId);
}

// Format date
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Get item status
function getItemStatus(item) {
    if (item.quantity === 0) return 'out';
    if (item.quantity <= item.totalQuantity * 0.2) return 'low';
    return 'available';
}

// Get status badge class
function getStatusClass(status) {
    return `status-${status}`;
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        'available': 'Available',
        'low': 'Low Stock',
        'out': 'Out of Stock',
        'pending': 'Pending',
        'approved': 'Approved',
        'rejected': 'Rejected',
        'returned': 'Returned',
        'issued': 'Issued',
        'active': 'Active',
        'revoked': 'Revoked',
        'reported': 'Reported',
        'under_review': 'Under Review',
        'repair_in_progress': 'Repair In Progress',
        'replaced': 'Replaced',
        'resolved': 'Resolved'
    };
    return statusMap[status] || status;
}

// Get transaction type text
function getTypeText(type) {
    const typeMap = {
        'borrow': 'Borrow',
        'issue': 'Issue'
    };
    return typeMap[type] || type;
}

// Check if user can borrow item
function canUserBorrowItem(item, userRole) {
    if (!item.isBorrowable) return false;
    if (!item.borrowableBy || item.borrowableBy.length === 0) return false;
    return item.borrowableBy.includes(userRole);
}

// Check if user can request issue for item
function canUserIssueItem(item, userRole) {
    if (!item.isIssuable) return false;
    if (!item.issuableBy || item.issuableBy.length === 0) return false;
    return item.issuableBy.includes(userRole);
}
