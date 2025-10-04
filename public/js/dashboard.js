// Dashboard Logic

document.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (!user) return;

    // Show page after auth check
    document.body.classList.add('loaded');

    document.getElementById('userDisplay').innerHTML = `
        <div>${user.name}</div>
        <div class="user-role">${user.role}</div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    loadStats(user);
    loadRecentActivity(user);

    if (user.role === 'admin' || user.role === 'staff') {
        loadPendingRequests(user);
        loadCharts(user);
    }

    if (user.role === 'student' || user.role === 'faculty') {
        loadMyBorrowings(user);
    }
});

function loadStats(user) {
    const statsGrid = document.getElementById('statsGrid');
    let stats = [];

    if (user.role === 'admin') {
        const totalItems = INVENTORY_ITEMS.length;
        const lowStockItems = INVENTORY_ITEMS.filter(item => getItemStatus(item) === 'low').length;
        const outOfStockItems = INVENTORY_ITEMS.filter(item => getItemStatus(item) === 'out').length;
        const pendingRequests = TRANSACTIONS.filter(t => t.status === 'pending').length;
        const activeBorrows = TRANSACTIONS.filter(t => t.status === 'approved' && t.transactionType === 'borrow').length;
        const activeIssues = TRANSACTIONS.filter(t => t.status === 'issued' && t.transactionType === 'issue').length;

        stats = [
            { label: 'Total Items', value: totalItems },
            { label: 'Pending Requests', value: pendingRequests },
            { label: 'Active Borrows', value: activeBorrows },
            { label: 'Active Issues', value: activeIssues },
            { label: 'Low Stock Items', value: lowStockItems },
            { label: 'Out of Stock Items', value: outOfStockItems }
        ];
    } else if (user.role === 'staff') {
        const pendingRequests = TRANSACTIONS.filter(t => t.status === 'pending').length;
        const approvedToday = TRANSACTIONS.filter(t =>
            t.status === 'approved' &&
            t.approvedDate === new Date().toISOString().split('T')[0]
        ).length;
        const issuedToday = TRANSACTIONS.filter(t =>
            t.status === 'issued' &&
            t.transactionType === 'issue' &&
            t.approvedDate === new Date().toISOString().split('T')[0]
        ).length;
        const borrowedToday = TRANSACTIONS.filter(t =>
            t.status === 'approved' &&
            t.transactionType === 'borrow' &&
            t.approvedDate === new Date().toISOString().split('T')[0]
        ).length;
        const lowStockItems = INVENTORY_ITEMS.filter(item => getItemStatus(item) === 'low').length;
        const outOfStockItems = INVENTORY_ITEMS.filter(item => getItemStatus(item) === 'out').length;

        stats = [
            { label: 'Pending Requests', value: pendingRequests },
            { label: 'Approved Today', value: approvedToday },
            { label: 'Issued Today', value: issuedToday },
            { label: 'Borrowed Today', value: borrowedToday },
            { label: 'Low Stock Items', value: lowStockItems },
            { label: 'Out of Stock', value: outOfStockItems }
        ];
    } else if (user.role === 'faculty') {
        const myRequests = TRANSACTIONS.filter(t => t.userId === user.id);
        const myPending = myRequests.filter(t => t.status === 'pending').length;
        const myApproved = myRequests.filter(t => t.status === 'approved' || t.status === 'issued').length;
        const myBorrows = myRequests.filter(t => t.status === 'approved' && t.transactionType === 'borrow').length;
        const myIssues = myRequests.filter(t => t.status === 'issued' && t.transactionType === 'issue').length;
        const availableItems = INVENTORY_ITEMS.filter(item =>
            item.quantity > 0 &&
            (canUserBorrowItem(item, user.role) || canUserIssueItem(item, user.role))
        ).length;

        stats = [
            { label: 'My Pending Requests', value: myPending },
            { label: 'My Approved', value: myApproved },
            { label: 'Items Borrowed', value: myBorrows },
            { label: 'Items Issued to Me', value: myIssues },
            { label: 'Available Items', value: availableItems }
        ];
    } else {
        const myRequests = TRANSACTIONS.filter(t => t.userId === user.id);
        const myPending = myRequests.filter(t => t.status === 'pending').length;
        const myApproved = myRequests.filter(t => t.status === 'approved').length;
        const myBorrows = myRequests.filter(t => t.status === 'approved' && t.transactionType === 'borrow').length;
        const myIssues = myRequests.filter(t => t.status === 'issued' && t.transactionType === 'issue').length;
        const availableItems = INVENTORY_ITEMS.filter(item =>
            item.quantity > 0 &&
            (canUserBorrowItem(item, user.role) || canUserIssueItem(item, user.role))
        ).length;

        stats = [
            { label: 'My Pending Requests', value: myPending },
            { label: 'My Approved Requests', value: myApproved },
            { label: 'Items Borrowed', value: myBorrows },
            { label: 'Items Issued to Me', value: myIssues },
            { label: 'Available Items', value: availableItems }
        ];
    }

    statsGrid.innerHTML = stats.map(stat => `
        <div class="stat-card">
            <h3>${stat.label}</h3>
            <div class="stat-value">${stat.value}</div>
        </div>
    `).join('');
}

function loadRecentActivity(user) {
    const activityContainer = document.getElementById('recentActivity');
    let activities = [];

    if (user.role === 'admin' || user.role === 'staff') {
        activities = TRANSACTIONS.slice(0, 5).map(t => {
            const item = getItemById(t.itemId);
            const requestUser = getUserById(t.userId);
            const actionType = t.transactionType === 'borrow' ? 'borrow' : 'issue';
            return {
                text: `${requestUser.name} requested to ${actionType} ${item.name}`,
                date: t.requestDate,
                status: t.status,
                type: t.transactionType
            };
        });
    } else {
        const myTransactions = TRANSACTIONS.filter(t => t.userId === user.id);
        activities = myTransactions.slice(0, 5).map(t => {
            const item = getItemById(t.itemId);
            const actionType = t.transactionType === 'borrow' ? 'borrow' : 'issue';
            return {
                text: `You requested to ${actionType} ${item.name}`,
                date: t.requestDate,
                status: t.status,
                type: t.transactionType
            };
        });
    }

    if (activities.length === 0) {
        activityContainer.innerHTML = '<p class="no-data">No recent activity</p>';
        return;
    }

    activityContainer.innerHTML = activities.map(activity => {
        const typeText = getTypeText(activity.type);
        return `
            <div class="activity-item">
                <strong>${activity.text}</strong>
                <span>${formatDate(activity.date)} -
                    <span class="status-badge ${getStatusClass(activity.status)}">${getStatusText(activity.status)}</span>
                    <span class="type-badge">${typeText}</span>
                </span>
            </div>
        `;
    }).join('');
}

function loadPendingRequests(user) {
    const requestsSection = document.getElementById('pendingRequests');
    const requestsList = document.getElementById('requestsList');

    requestsSection.style.display = 'block';

    const pendingRequests = TRANSACTIONS.filter(t => t.status === 'pending');

    if (pendingRequests.length === 0) {
        requestsList.innerHTML = '<p class="no-data">No pending requests</p>';
        return;
    }

    requestsList.innerHTML = pendingRequests.map(t => {
        const item = getItemById(t.itemId);
        const requestUser = getUserById(t.userId);
        const actionType = t.transactionType === 'borrow' ? 'Borrow' : 'Issue';
        return `
            <div class="request-item">
                <strong>${requestUser.name} - ${item.name}</strong>
                <span>Type: <strong>${actionType}</strong> | Quantity: ${t.quantity} | ${formatDate(t.requestDate)}</span>
                <p style="margin-top: 8px; color: var(--text-light);">Reason: ${t.reason}</p>
                <div class="request-actions">
                    <button class="btn-success" onclick="approveRequest(${t.id})">Approve ${actionType}</button>
                    <button class="btn-danger" onclick="rejectRequest(${t.id})">Reject</button>
                </div>
            </div>
        `;
    }).join('');
}

function loadMyBorrowings(user) {
    const borrowingsSection = document.getElementById('myBorrowings');
    const borrowingsList = document.getElementById('borrowingsList');

    borrowingsSection.style.display = 'block';

    const myBorrowings = TRANSACTIONS.filter(t =>
        t.userId === user.id &&
        (t.status === 'approved' || t.status === 'issued')
    );

    if (myBorrowings.length === 0) {
        borrowingsList.innerHTML = '<p class="no-data">No current borrowings or issues</p>';
        return;
    }

    borrowingsList.innerHTML = myBorrowings.map(t => {
        const item = getItemById(t.itemId);
        const isBorrow = t.transactionType === 'borrow';
        const actionType = isBorrow ? 'Borrowed' : 'Issued';
        return `
            <div class="borrowing-item">
                <strong>${item.name}</strong>
                <span>Type: <strong>${actionType}</strong> | Quantity: ${t.quantity} | Date: ${formatDate(t.approvedDate)}</span>
                <div class="borrowing-actions">
                    ${isBorrow && t.status === 'approved' ? `
                        <button class="btn-secondary" onclick="returnItem(${t.id})">Mark as Returned</button>
                    ` : ''}
                    ${!isBorrow ? `
                        <span class="status-badge status-issued">Permanently Issued</span>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function loadCharts(user) {
    const container = document.querySelector('.container');
    let chartsSection = document.getElementById('chartsSection');

    if (!chartsSection) {
        chartsSection = document.createElement('div');
        chartsSection.id = 'chartsSection';
        chartsSection.className = 'charts-section';
        chartsSection.innerHTML = `
            <h2 style="color: var(--primary-red); margin: 40px 0 20px 0;">Analytics & Insights</h2>
            <div class="charts-grid">
                <div class="chart-card">
                    <h3>Transaction Type Distribution</h3>
                    <canvas id="transactionTypeChart"></canvas>
                </div>
                <div class="chart-card">
                    <h3>Request Status Overview</h3>
                    <canvas id="statusChart"></canvas>
                </div>
                <div class="chart-card">
                    <h3>Department-wise Inventory</h3>
                    <canvas id="departmentChart"></canvas>
                </div>
                <div class="chart-card">
                    <h3>Monthly Activity Trend</h3>
                    <canvas id="trendChart"></canvas>
                </div>
            </div>
        `;
        container.appendChild(chartsSection);
    }

    if (typeof Chart !== 'undefined') {
        createCharts();
    }
}

function createCharts() {
    createTransactionTypeChart();
    createStatusChart();
    createDepartmentChart();
    createTrendChart();
}

function createTransactionTypeChart() {
    const ctx = document.getElementById('transactionTypeChart');
    if (!ctx) return;

    const borrowCount = TRANSACTIONS.filter(t => t.transactionType === 'borrow').length;
    const issueCount = TRANSACTIONS.filter(t => t.transactionType === 'issue').length;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Borrow', 'Issue'],
            datasets: [{
                data: [borrowCount, issueCount],
                backgroundColor: ['#1976d2', '#7b1fa2'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;

    const statusCounts = {
        pending: TRANSACTIONS.filter(t => t.status === 'pending').length,
        approved: TRANSACTIONS.filter(t => t.status === 'approved').length,
        issued: TRANSACTIONS.filter(t => t.status === 'issued').length,
        rejected: TRANSACTIONS.filter(t => t.status === 'rejected').length,
        returned: TRANSACTIONS.filter(t => t.status === 'returned').length
    };

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pending', 'Approved', 'Issued', 'Rejected', 'Returned'],
            datasets: [{
                label: 'Number of Transactions',
                data: [statusCounts.pending, statusCounts.approved, statusCounts.issued, statusCounts.rejected, statusCounts.returned],
                backgroundColor: ['#ffc107', '#28a745', '#17a2b8', '#dc3545', '#6c757d'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createDepartmentChart() {
    const ctx = document.getElementById('departmentChart');
    if (!ctx) return;

    const departmentCounts = {};
    DEPARTMENTS.forEach(dept => {
        departmentCounts[dept.name] = INVENTORY_ITEMS.filter(item => item.departmentId === dept.id).length;
    });

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(departmentCounts),
            datasets: [{
                data: Object.values(departmentCounts),
                backgroundColor: [
                    '#a50d23',
                    '#1976d2',
                    '#388e3c',
                    '#f57c00',
                    '#7b1fa2',
                    '#0097a7',
                    '#c2185b'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        fontSize: 10
                    }
                }
            }
        }
    });
}

function createTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    const last7Days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
    }

    const borrowData = last7Days.map(date =>
        TRANSACTIONS.filter(t => t.requestDate === date && t.transactionType === 'borrow').length
    );

    const issueData = last7Days.map(date =>
        TRANSACTIONS.filter(t => t.requestDate === date && t.transactionType === 'issue').length
    );

    const labels = last7Days.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Borrow Requests',
                    data: borrowData,
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Issue Requests',
                    data: issueData,
                    borderColor: '#7b1fa2',
                    backgroundColor: 'rgba(123, 31, 162, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

function approveRequest(transactionId) {
    const transaction = TRANSACTIONS.find(t => t.id === transactionId);
    if (transaction) {
        const item = getItemById(transaction.itemId);

        if (item.quantity < transaction.quantity) {
            alert('Not enough quantity available!');
            return;
        }

        const actionType = transaction.transactionType === 'borrow' ? 'approved' : 'issued';
        transaction.status = actionType;
        transaction.approvedDate = new Date().toISOString().split('T')[0];

        item.quantity -= transaction.quantity;

        const typeText = transaction.transactionType === 'borrow' ? 'Borrow' : 'Issue';
        alert(`${typeText} request approved successfully!`);
        location.reload();
    }
}

function rejectRequest(transactionId) {
    const transaction = TRANSACTIONS.find(t => t.id === transactionId);
    if (transaction) {
        transaction.status = 'rejected';
        transaction.approvedDate = new Date().toISOString().split('T')[0];

        alert('Request rejected!');
        location.reload();
    }
}

function returnItem(transactionId) {
    const transaction = TRANSACTIONS.find(t => t.id === transactionId);
    if (transaction) {
        transaction.status = 'returned';
        transaction.return_date = new Date().toISOString().split('T')[0];

        const item = getItemById(transaction.itemId);
        item.quantity += transaction.quantity;

        alert('Item marked as returned!');
        location.reload();
    }
}
