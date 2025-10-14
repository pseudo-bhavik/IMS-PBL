let allItems = [];
let allTransactions = [];

document.addEventListener('DOMContentLoaded', async function() {
    let user = checkAuth();
    if (!user) return;

    try {
        const backendUser = await API.request(API_CONFIG.ENDPOINTS.ME);
        if (backendUser) {
            setCurrentUser(backendUser);
            user = backendUser;
        }
    } catch (error) {
        console.error('Failed to verify session with backend:', error);
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
        return;
    }

    document.body.classList.add('loaded');

    document.getElementById('userDisplay').innerHTML = `
        <div>${user.name}</div>
        <div class="user-role">${user.role}</div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    await loadData(user);
    displayDashboard(user);
});

async function loadData(user) {
    try {
        [allItems, allTransactions] = await Promise.all([
            API.getItems(),
            API.getTransactions()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load dashboard data');
    }
}

function displayDashboard(user) {
    loadStats(user);
    loadRecentActivity(user);

    if (user.role === 'admin' || user.role === 'staff') {
        loadPendingRequests(user);
        loadCharts(user);
    }

    if (user.role === 'student' || user.role === 'faculty') {
        loadMyBorrowings(user);
    }
}

function loadStats(user) {
    const statsGrid = document.getElementById('statsGrid');
    let stats = [];

    if (user.role === 'admin') {
        const totalItems = allItems.length;
        const lowStockItems = allItems.filter(item => getItemStatus(item) === 'low').length;
        const outOfStockItems = allItems.filter(item => getItemStatus(item) === 'out').length;
        const pendingRequests = allTransactions.filter(t => t.status === 'pending').length;
        const activeBorrows = allTransactions.filter(t => t.status === 'approved' && t.transactionType === 'borrow').length;
        const activeIssues = allTransactions.filter(t => t.status === 'issued' && t.transactionType === 'issue').length;

        stats = [
            { label: 'Total Items', value: totalItems },
            { label: 'Pending Requests', value: pendingRequests },
            { label: 'Active Borrows', value: activeBorrows },
            { label: 'Active Issues', value: activeIssues },
            { label: 'Low Stock Items', value: lowStockItems },
            { label: 'Out of Stock Items', value: outOfStockItems }
        ];
    } else if (user.role === 'staff') {
        const pendingRequests = allTransactions.filter(t => t.status === 'pending').length;
        const today = new Date().toISOString().split('T')[0];
        const approvedToday = allTransactions.filter(t =>
            t.status === 'approved' &&
            t.approvedDate && t.approvedDate.startsWith(today)
        ).length;
        const lowStockItems = allItems.filter(item => getItemStatus(item) === 'low').length;
        const outOfStockItems = allItems.filter(item => getItemStatus(item) === 'out').length;

        stats = [
            { label: 'Pending Requests', value: pendingRequests },
            { label: 'Approved Today', value: approvedToday },
            { label: 'Low Stock Items', value: lowStockItems },
            { label: 'Out of Stock', value: outOfStockItems }
        ];
    } else if (user.role === 'faculty') {
        const myRequests = allTransactions.filter(t => t.userId === user.id);
        const myPending = myRequests.filter(t => t.status === 'pending').length;
        const myApproved = myRequests.filter(t => t.status === 'approved' || t.status === 'issued').length;
        const myBorrows = myRequests.filter(t => t.status === 'approved' && t.transactionType === 'borrow').length;
        const myIssues = myRequests.filter(t => t.status === 'issued' && t.transactionType === 'issue').length;
        const availableItems = allItems.filter(item => item.quantity > 0).length;

        stats = [
            { label: 'My Pending Requests', value: myPending },
            { label: 'My Approved', value: myApproved },
            { label: 'Items Borrowed', value: myBorrows },
            { label: 'Items Issued to Me', value: myIssues },
            { label: 'Available Items', value: availableItems }
        ];
    } else {
        const myRequests = allTransactions.filter(t => t.userId === user.id);
        const myPending = myRequests.filter(t => t.status === 'pending').length;
        const myApproved = myRequests.filter(t => t.status === 'approved').length;
        const myBorrows = myRequests.filter(t => t.status === 'approved' && t.transactionType === 'borrow').length;
        const myIssues = myRequests.filter(t => t.status === 'issued' && t.transactionType === 'issue').length;
        const availableItems = allItems.filter(item => item.quantity > 0).length;

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
        activities = allTransactions.slice(0, 5).map(t => {
            const item = allItems.find(i => i.id === t.itemId);
            const actionType = t.transactionType === 'borrow' ? 'borrow' : 'issue';
            return {
                text: `Request to ${actionType} ${item ? item.name : 'Unknown Item'}`,
                date: t.requestDate,
                status: t.status,
                type: t.transactionType
            };
        });
    } else {
        const myTransactions = allTransactions.filter(t => t.userId === user.id);
        activities = myTransactions.slice(0, 5).map(t => {
            const item = allItems.find(i => i.id === t.itemId);
            const actionType = t.transactionType === 'borrow' ? 'borrow' : 'issue';
            return {
                text: `You requested to ${actionType} ${item ? item.name : 'Unknown Item'}`,
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
        const typeText = activity.type === 'borrow' ? 'Borrow' : 'Issue';
        const statusText = activity.status.charAt(0).toUpperCase() + activity.status.slice(1);
        return `
            <div class="activity-item">
                <strong>${activity.text}</strong>
                <span>${formatDate(activity.date)} -
                    <span class="status-badge ${getStatusClass(activity.status)}">${statusText}</span>
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

    const pendingRequests = allTransactions.filter(t => t.status === 'pending');

    if (pendingRequests.length === 0) {
        requestsList.innerHTML = '<p class="no-data">No pending requests</p>';
        return;
    }

    requestsList.innerHTML = pendingRequests.map(t => {
        const item = allItems.find(i => i.id === t.itemId);
        const actionType = t.transactionType === 'borrow' ? 'Borrow' : 'Issue';
        return `
            <div class="request-item">
                <strong>${item ? item.name : 'Unknown Item'}</strong>
                <span>Type: <strong>${actionType}</strong> | Quantity: ${t.quantity} | ${formatDate(t.requestDate)}</span>
                <p style="margin-top: 8px; color: var(--text-light);">Reason: ${t.reason || 'No reason provided'}</p>
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

    const myBorrowings = allTransactions.filter(t =>
        t.userId === user.id &&
        (t.status === 'approved' || t.status === 'issued')
    );

    if (myBorrowings.length === 0) {
        borrowingsList.innerHTML = '<p class="no-data">No current borrowings or issues</p>';
        return;
    }

    borrowingsList.innerHTML = myBorrowings.map(t => {
        const item = allItems.find(i => i.id === t.itemId);
        const isBorrow = t.transactionType === 'borrow';
        const actionType = isBorrow ? 'Borrowed' : 'Issued';
        return `
            <div class="borrowing-item">
                <strong>${item ? item.name : 'Unknown Item'}</strong>
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
                    <h3>Request Status Overview</h3>
                    <canvas id="statusChart"></canvas>
                </div>
                <div class="chart-card">
                    <h3>Transaction Types</h3>
                    <canvas id="typeChart"></canvas>
                </div>
            </div>
        `;
        container.appendChild(chartsSection);
    }

    if (typeof Chart !== 'undefined') {
        setTimeout(() => createCharts(), 100);
    }
}

function createCharts() {
    createStatusChart();
    createTypeChart();
}

function createStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;

    const statusCounts = {
        pending: allTransactions.filter(t => t.status === 'pending').length,
        approved: allTransactions.filter(t => t.status === 'approved').length,
        issued: allTransactions.filter(t => t.status === 'issued').length,
        rejected: allTransactions.filter(t => t.status === 'rejected').length,
        returned: allTransactions.filter(t => t.status === 'returned').length
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

function createTypeChart() {
    const ctx = document.getElementById('typeChart');
    if (!ctx) return;

    const borrowCount = allTransactions.filter(t => t.transactionType === 'borrow').length;
    const issueCount = allTransactions.filter(t => t.transactionType === 'issue').length;

    new Chart(ctx, {
        type: 'pie',
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

async function approveRequest(transactionId) {
    try {
        await API.approveTransaction(transactionId);
        alert('Request approved successfully!');
        location.reload();
    } catch (error) {
        alert('Failed to approve request: ' + error.message);
    }
}

async function rejectRequest(transactionId) {
    try {
        await API.deleteTransaction(transactionId);
        alert('Request rejected!');
        location.reload();
    } catch (error) {
        alert('Failed to reject request: ' + error.message);
    }
}

async function returnItem(transactionId) {
    try {
        await API.returnItem(transactionId);
        alert('Item marked as returned!');
        location.reload();
    } catch (error) {
        alert('Failed to return item: ' + error.message);
    }
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getStatusClass(status) {
    const statusMap = {
        'pending': 'status-pending',
        'approved': 'status-approved',
        'issued': 'status-issued',
        'rejected': 'status-rejected',
        'returned': 'status-returned'
    };
    return statusMap[status] || '';
}
