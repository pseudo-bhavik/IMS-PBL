// Transactions Management Logic

let currentUser = null;
let allTransactions = [];
let allItems = [];
let filteredTransactions = [];
let DEPARTMENTS = [];

document.addEventListener('DOMContentLoaded', async function() {
    currentUser = checkAuth();
    if (!currentUser) return;

    try {
        const backendUser = await API.request(API_CONFIG.ENDPOINTS.ME);
        if (backendUser) {
            setCurrentUser(backendUser);
            currentUser = backendUser;
        }
    } catch (error) {
        console.error('Failed to verify session with backend:', error);
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
        return;
    }

    document.body.classList.add('loaded');

    document.getElementById('userDisplay').innerHTML = `
        <div>${currentUser.name}</div>
        <div class="user-role">${currentUser.role}</div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('departmentFilter').addEventListener('change', applyFilters);
    document.getElementById('typeFilter').addEventListener('change', applyFilters);

    if (currentUser.role === 'student' || currentUser.role === 'faculty') {
        document.getElementById('actionsHeader').style.display = 'none';
    }

    await loadData();
    loadDepartmentFilter();
    applyFilters();
});

async function loadData() {
    try {
        [allTransactions, allItems, DEPARTMENTS] = await Promise.all([
            API.getTransactions(),
            API.getItems(),
            API.getDepartments()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load transactions');
        allTransactions = [];
        allItems = [];
        DEPARTMENTS = [];
    }
}

function loadDepartmentFilter() {
    const departmentFilter = document.getElementById('departmentFilter');

    DEPARTMENTS.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id;
        option.textContent = dept.name;
        departmentFilter.appendChild(option);
    });
}

function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const departmentId = parseInt(document.getElementById('departmentFilter').value) || null;
    const typeFilter = document.getElementById('typeFilter').value;

    filteredTransactions = allTransactions.filter(transaction => {
        const item = allItems.find(i => i.id === transaction.itemId);
        if (!item) return false;

        const matchesStatus = !statusFilter || transaction.status === statusFilter;
        const matchesDepartment = !departmentId || item.departmentId === departmentId;
        const matchesType = !typeFilter || transaction.transactionType === typeFilter;

        if (currentUser.role === 'student' || currentUser.role === 'faculty') {
            return matchesStatus && matchesDepartment && matchesType && transaction.userId === currentUser.id;
        }

        return matchesStatus && matchesDepartment && matchesType;
    });

    displayTransactions();
}

function displayTransactions() {
    const tableBody = document.getElementById('transactionsTable');

    let transactionsToShow = filteredTransactions;

    if (currentUser.role === 'student' || currentUser.role === 'faculty') {
        transactionsToShow = filteredTransactions.filter(t => t.userId === currentUser.id);
    }

    if (transactionsToShow.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" class="text-center">No transactions found</td></tr>';
        return;
    }

    tableBody.innerHTML = transactionsToShow.map(transaction => {
        const item = allItems.find(i => i.id === transaction.itemId);
        if (!item) return '';

        const user = getUserById(transaction.userId);
        const canTakeAction = (currentUser.role === 'admin' || currentUser.role === 'staff') &&
                             transaction.status === 'pending';

        const transactionTypeText = transaction.transactionType === 'borrow' ? 'Borrow' : 'Issue';
        const typeBadgeClass = transaction.transactionType === 'borrow' ? 'badge-borrowable' : 'badge-issuable';

        return `
            <tr>
                <td>#${transaction.id}</td>
                <td>${item.name}</td>
                <td>${user ? user.name : 'Unknown'}</td>
                <td>${getDepartmentName(item.departmentId)}</td>
                <td>
                    <span class="${typeBadgeClass}" style="padding: 4px 8px; font-size: 0.85rem;">
                        ${transactionTypeText}
                    </span>
                </td>
                <td>${transaction.quantity}</td>
                <td>${formatDate(transaction.requestDate)}</td>
                <td>
                    <span class="status-badge ${getStatusClass(transaction.status)}">
                        ${getStatusText(transaction.status)}
                    </span>
                </td>
                <td>
                    ${canTakeAction ? `
                        <div class="table-actions">
                            <button class="btn-success" onclick="approveTransaction(${transaction.id})">
                                Approve
                            </button>
                            <button class="btn-danger" onclick="rejectTransaction(${transaction.id})">
                                Reject
                            </button>
                        </div>
                    ` : (currentUser.role === 'student' || currentUser.role === 'faculty') ? '' : '-'}
                </td>
            </tr>
        `;
    }).join('');
}

async function approveTransaction(transactionId) {
    if (!confirm('Are you sure you want to approve this request?')) return;

    try {
        await API.approveTransaction(transactionId);
        alert('Transaction approved successfully!');
        await loadData();
        applyFilters();
    } catch (error) {
        console.error('Error approving transaction:', error);
        alert('Failed to approve transaction: ' + error.message);
    }
}

async function rejectTransaction(transactionId) {
    if (!confirm('Are you sure you want to reject this request?')) return;

    try {
        await API.deleteTransaction(transactionId);
        alert('Transaction rejected!');
        await loadData();
        applyFilters();
    } catch (error) {
        console.error('Error rejecting transaction:', error);
        alert('Failed to reject transaction: ' + error.message);
    }
}
