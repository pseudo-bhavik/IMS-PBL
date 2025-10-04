// Inventory Management Logic

let currentUser = null;
let filteredItems = [...INVENTORY_ITEMS];

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

    if (currentUser.role === 'admin' || currentUser.role === 'staff') {
        document.getElementById('addItemBtn').style.display = 'block';
        document.getElementById('addItemBtn').addEventListener('click', openAddModal);
    }

    loadFilters();

    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('departmentFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);

    setupModals();

    displayInventory();
});

function loadFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    const itemCategory = document.getElementById('itemCategory');
    const itemDepartment = document.getElementById('itemDepartment');

    CATEGORIES.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categoryFilter.appendChild(option.cloneNode(true));
        if (itemCategory) itemCategory.appendChild(option);
    });

    DEPARTMENTS.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id;
        option.textContent = dept.name;
        departmentFilter.appendChild(option.cloneNode(true));
        if (itemDepartment) itemDepartment.appendChild(option);
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryId = parseInt(document.getElementById('categoryFilter').value) || null;
    const departmentId = parseInt(document.getElementById('departmentFilter').value) || null;
    const statusFilter = document.getElementById('statusFilter').value;

    filteredItems = INVENTORY_ITEMS.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                            item.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryId || item.categoryId === categoryId;
        const matchesDepartment = !departmentId || item.departmentId === departmentId;
        const matchesStatus = !statusFilter || getItemStatus(item) === statusFilter;

        return matchesSearch && matchesCategory && matchesDepartment && matchesStatus;
    });

    displayInventory();
}

function displayInventory() {
    const grid = document.getElementById('inventoryGrid');

    if (filteredItems.length === 0) {
        grid.innerHTML = '<div class="no-data">No items found</div>';
        return;
    }

    grid.innerHTML = filteredItems.map(item => {
        const status = getItemStatus(item);
        const canEdit = currentUser.role === 'admin' || currentUser.role === 'staff';
        const canDelete = currentUser.role === 'admin';

        const canBorrow = canUserBorrowItem(item, currentUser.role) && item.quantity > 0;
        const canIssue = canUserIssueItem(item, currentUser.role) && item.quantity > 0;
        const canRequest = (currentUser.role === 'student' || currentUser.role === 'faculty') && (canBorrow || canIssue);

        const availabilityBadges = [];
        if (item.isBorrowable && item.borrowableBy && item.borrowableBy.length > 0) {
            const borrowText = item.borrowableBy.join(', ');
            availabilityBadges.push(`<span class="badge-borrowable" title="Borrowable by: ${borrowText}">Borrowable</span>`);
        }
        if (item.isIssuable && item.issuableBy && item.issuableBy.length > 0) {
            const issueText = item.issuableBy.join(', ');
            availabilityBadges.push(`<span class="badge-issuable" title="Issuable to: ${issueText}">Issuable</span>`);
        }

        let requestButtons = '';
        if (canRequest) {
            if (canBorrow && canIssue) {
                requestButtons = `
                    <button class="btn-success" onclick="openCheckoutModal(${item.id}, 'borrow')">Borrow</button>
                    <button class="btn-success" onclick="openCheckoutModal(${item.id}, 'issue')">Issue</button>
                `;
            } else if (canBorrow) {
                requestButtons = `<button class="btn-success" onclick="openCheckoutModal(${item.id}, 'borrow')">Borrow</button>`;
            } else if (canIssue) {
                requestButtons = `<button class="btn-success" onclick="openCheckoutModal(${item.id}, 'issue')">Issue</button>`;
            }
        }

        return `
            <div class="inventory-item">
                <div class="item-header">
                    <h3>${item.name}</h3>
                    <span class="item-category">${getCategoryName(item.categoryId)}</span>
                </div>

                <div class="item-details">
                    <p><strong>Department:</strong> ${getDepartmentName(item.departmentId)}</p>
                    <p>${item.description}</p>
                    <div class="item-badges">
                        ${availabilityBadges.join(' ')}
                    </div>
                </div>

                <div class="item-quantity">
                    <div class="quantity-info">
                        <span class="quantity-label">Available:</span>
                        <span class="quantity-badge">${item.quantity}</span>
                    </div>
                    <span class="status-badge ${getStatusClass(status)}">${getStatusText(status)}</span>
                </div>

                <div class="item-actions">
                    ${canEdit ? `
                        <button class="btn-primary" onclick="openEditModal(${item.id})">Edit</button>
                    ` : ''}
                    ${canDelete ? `
                        <button class="btn-danger" onclick="deleteItem(${item.id})">Delete</button>
                    ` : ''}
                    ${requestButtons}
                    ${!canEdit && !canRequest ? `
                        <button class="btn-secondary" disabled>View Only</button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function setupModals() {
    const itemModal = document.getElementById('itemModal');
    const checkoutModal = document.getElementById('checkoutModal');
    const itemForm = document.getElementById('itemForm');
    const checkoutForm = document.getElementById('checkoutForm');

    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            itemModal.style.display = 'none';
            checkoutModal.style.display = 'none';
        });
    });

    document.getElementById('cancelBtn').addEventListener('click', function() {
        itemModal.style.display = 'none';
    });

    document.getElementById('cancelCheckoutBtn').addEventListener('click', function() {
        checkoutModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === itemModal) itemModal.style.display = 'none';
        if (e.target === checkoutModal) checkoutModal.style.display = 'none';
    });

    itemForm.addEventListener('submit', handleItemSubmit);
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Add New Item';
    document.getElementById('itemForm').reset();
    document.getElementById('itemId').value = '';

    document.getElementById('isBorrowable').checked = true;
    document.getElementById('isIssuable').checked = false;
    updateBorrowableOptions();
    updateIssuableOptions();

    document.getElementById('itemModal').style.display = 'block';
}

function openEditModal(itemId) {
    const item = getItemById(itemId);
    if (!item) return;

    document.getElementById('modalTitle').textContent = 'Edit Item';
    document.getElementById('itemId').value = item.id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.categoryId;
    document.getElementById('itemDepartment').value = item.departmentId;
    document.getElementById('itemQuantity').value = item.quantity;
    document.getElementById('itemTotalQuantity').value = item.totalQuantity;
    document.getElementById('itemDescription').value = item.description;

    document.getElementById('isBorrowable').checked = item.isBorrowable;
    document.getElementById('isIssuable').checked = item.isIssuable;

    updateBorrowableOptions();
    updateIssuableOptions();

    if (item.borrowableBy) {
        document.querySelectorAll('input[name="borrowableBy"]').forEach(checkbox => {
            checkbox.checked = item.borrowableBy.includes(checkbox.value);
        });
    }

    if (item.issuableBy) {
        document.querySelectorAll('input[name="issuableBy"]').forEach(checkbox => {
            checkbox.checked = item.issuableBy.includes(checkbox.value);
        });
    }

    document.getElementById('itemModal').style.display = 'block';
}

function updateBorrowableOptions() {
    const isBorrowable = document.getElementById('isBorrowable').checked;
    const borrowableOptions = document.getElementById('borrowableOptions');
    borrowableOptions.style.display = isBorrowable ? 'block' : 'none';
}

function updateIssuableOptions() {
    const isIssuable = document.getElementById('isIssuable').checked;
    const issuableOptions = document.getElementById('issuableOptions');
    issuableOptions.style.display = isIssuable ? 'block' : 'none';
}

function openCheckoutModal(itemId, transactionType) {
    const item = getItemById(itemId);
    if (!item) return;

    document.getElementById('checkoutItemId').value = item.id;
    document.getElementById('checkoutTransactionType').value = transactionType;

    const modalTitle = transactionType === 'borrow' ? 'Request Item Borrow' : 'Request Item Issue';
    document.querySelector('#checkoutModal h2').textContent = modalTitle;

    document.getElementById('checkoutItemName').textContent = item.name;
    document.getElementById('checkoutAvailable').textContent = item.quantity;
    document.getElementById('checkoutQuantity').max = item.quantity;
    document.getElementById('checkoutQuantity').value = 1;
    document.getElementById('checkoutReason').value = '';

    const typeDescription = transactionType === 'borrow'
        ? 'You will need to return this item after use.'
        : 'This item will be permanently issued to you.';
    document.getElementById('checkoutTypeDescription').textContent = typeDescription;

    document.getElementById('checkoutModal').style.display = 'block';
}

function handleItemSubmit(e) {
    e.preventDefault();

    const itemId = document.getElementById('itemId').value;
    const isBorrowable = document.getElementById('isBorrowable').checked;
    const isIssuable = document.getElementById('isIssuable').checked;

    const borrowableBy = [];
    if (isBorrowable) {
        document.querySelectorAll('input[name="borrowableBy"]:checked').forEach(checkbox => {
            borrowableBy.push(checkbox.value);
        });
    }

    const issuableBy = [];
    if (isIssuable) {
        document.querySelectorAll('input[name="issuableBy"]:checked').forEach(checkbox => {
            issuableBy.push(checkbox.value);
        });
    }

    if (!isBorrowable && !isIssuable) {
        alert('Item must be either borrowable or issuable (or both)');
        return;
    }

    if (isBorrowable && borrowableBy.length === 0) {
        alert('Please select who can borrow this item');
        return;
    }

    if (isIssuable && issuableBy.length === 0) {
        alert('Please select who can request issue for this item');
        return;
    }

    const itemData = {
        name: document.getElementById('itemName').value,
        categoryId: parseInt(document.getElementById('itemCategory').value),
        departmentId: parseInt(document.getElementById('itemDepartment').value),
        quantity: parseInt(document.getElementById('itemQuantity').value),
        totalQuantity: parseInt(document.getElementById('itemTotalQuantity').value),
        description: document.getElementById('itemDescription').value,
        isBorrowable: isBorrowable,
        isIssuable: isIssuable,
        borrowableBy: borrowableBy,
        issuableBy: issuableBy
    };

    if (itemId) {
        const item = getItemById(parseInt(itemId));
        Object.assign(item, itemData);
        alert('Item updated successfully!');
    } else {
        const newItem = {
            id: INVENTORY_ITEMS.length + 1,
            ...itemData
        };
        INVENTORY_ITEMS.push(newItem);
        alert('Item added successfully!');
    }

    document.getElementById('itemModal').style.display = 'none';
    applyFilters();
}

function handleCheckoutSubmit(e) {
    e.preventDefault();

    const itemId = parseInt(document.getElementById('checkoutItemId').value);
    const quantity = parseInt(document.getElementById('checkoutQuantity').value);
    const reason = document.getElementById('checkoutReason').value;
    const transactionType = document.getElementById('checkoutTransactionType').value;

    const item = getItemById(itemId);
    if (!item || quantity > item.quantity) {
        alert('Invalid quantity!');
        return;
    }

    const newTransaction = {
        id: TRANSACTIONS.length + 1,
        itemId: itemId,
        userId: currentUser.id,
        quantity: quantity,
        status: 'pending',
        transactionType: transactionType,
        requestDate: new Date().toISOString().split('T')[0],
        approvedDate: null,
        reason: reason
    };

    TRANSACTIONS.push(newTransaction);

    const actionText = transactionType === 'borrow' ? 'borrow' : 'issue';
    alert(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} request submitted successfully! Waiting for approval.`);
    document.getElementById('checkoutModal').style.display = 'none';
}

function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const index = INVENTORY_ITEMS.findIndex(item => item.id === itemId);
    if (index > -1) {
        INVENTORY_ITEMS.splice(index, 1);
        alert('Item deleted successfully!');
        applyFilters();
    }
}
