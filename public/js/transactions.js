// Transactions Management Logic

let currentUser = null;
let filteredTransactions = [...TRANSACTIONS];

document.addEventListener('DOMContentLoaded', function() {
    currentUser = checkAuth();
    if (!currentUser) return;

    // Show page after auth check
    document.body.classList.add('loaded');

    document.getElementById('userDisplay').innerHTML = `
        <div>${currentUser.name}</div>
        <div class="user-role">${currentUser.role}</div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    loadDepartmentFilter();

    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('departmentFilter').addEventListener('change', applyFilters);
    document.getElementById('typeFilter').addEventListener('change', applyFilters);

    if (currentUser.role === 'student' || currentUser.role === 'faculty') {
        document.getElementById('actionsHeader').style.display = 'none';
    }

    displayTransactions();
});

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

    filteredTransactions = TRANSACTIONS.filter(transaction => {
        const item = getItemById(transaction.itemId);
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
        const item = getItemById(transaction.itemId);
        const user = getUserById(transaction.userId);
        const canTakeAction = (currentUser.role === 'admin' || currentUser.role === 'staff') &&
                             transaction.status === 'pending';

        const transactionTypeText = transaction.transactionType === 'borrow' ? 'Borrow' : 'Issue';
        const typeBadgeClass = transaction.transactionType === 'borrow' ? 'badge-borrowable' : 'badge-issuable';

        return `
            <tr>
                <td>#${transaction.id}</td>
                <td>${item.name}</td>
                <td>${user.name}</td>
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

function approveTransaction(transactionId) {
    const transaction = TRANSACTIONS.find(t => t.id === transactionId);
    if (!transaction) return;

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
    displayTransactions();
}

function rejectTransaction(transactionId) {
    const transaction = TRANSACTIONS.find(t => t.id === transactionId);
    if (!transaction) return;

    if (!confirm('Are you sure you want to reject this request?')) return;

    transaction.status = 'rejected';
    transaction.approvedDate = new Date().toISOString().split('T')[0];

    alert('Transaction rejected!');
    displayTransactions();
}
