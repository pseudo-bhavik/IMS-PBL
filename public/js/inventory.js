// Inventory Management Logic

let currentUser = null;
let allItems = [];
let filteredItems = [];
let CATEGORIES = [];
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

    if (currentUser.role === 'admin' || currentUser.role === 'staff') {
        document.getElementById('addItemBtn').style.display = 'block';
        document.getElementById('addItemBtn').addEventListener('click', openAddModal);
    }

    if (currentUser.role === 'admin') {
        const addCategoryBtn = document.getElementById('addCategoryBtn');
        const addDepartmentBtn = document.getElementById('addDepartmentBtn');
        if (addCategoryBtn) {
            addCategoryBtn.style.display = 'block';
            addCategoryBtn.addEventListener('click', openAddCategoryModal);
        }
        if (addDepartmentBtn) {
            addDepartmentBtn.style.display = 'block';
            addDepartmentBtn.addEventListener('click', openAddDepartmentModal);
        }
    }

    loadFilters();

    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('departmentFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);

    setupModals();

    await loadCategoriesAndDepartments();
    loadFilters();
    await loadItems();
    applyFilters();
});

async function loadCategoriesAndDepartments() {
    try {
        CATEGORIES = await API.getCategories();
        DEPARTMENTS = await API.getDepartments();
    } catch (error) {
        console.error('Error loading categories/departments:', error);
        CATEGORIES = [];
        DEPARTMENTS = [];
    }
}

async function loadItems() {
    try {
        allItems = await API.getItems();
    } catch (error) {
        console.error('Error loading items:', error);
        alert('Failed to load inventory items');
        allItems = [];
    }
}

function loadFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    const itemCategory = document.getElementById('itemCategory');
    const itemDepartment = document.getElementById('itemDepartment');

    // Clear existing options (except first "All" option)
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }
    while (departmentFilter.options.length > 1) {
        departmentFilter.remove(1);
    }
    if (itemCategory) {
        while (itemCategory.options.length > 0) {
            itemCategory.remove(0);
        }
    }
    if (itemDepartment) {
        while (itemDepartment.options.length > 0) {
            itemDepartment.remove(0);
        }
    }

    // Add category options
    CATEGORIES.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categoryFilter.appendChild(option.cloneNode(true));
        if (itemCategory) itemCategory.appendChild(option.cloneNode(true));
    });

    // Add department options
    DEPARTMENTS.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id;
        option.textContent = dept.name;
        departmentFilter.appendChild(option.cloneNode(true));
        if (itemDepartment) itemDepartment.appendChild(option.cloneNode(true));
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryId = parseInt(document.getElementById('categoryFilter').value) || null;
    const departmentId = parseInt(document.getElementById('departmentFilter').value) || null;
    const statusFilter = document.getElementById('statusFilter').value;

    filteredItems = allItems.filter(item => {
        if (currentUser.role !== 'admin' && currentUser.role !== 'staff') {
            if (item.status !== 'approved') return false;
        }

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
        const isPending = item.status && item.status === 'pending';
        const isRejected = item.status && item.status === 'rejected';
        const canEdit = currentUser.role === 'admin' || currentUser.role === 'staff';
        const canDelete = currentUser.role === 'admin';
        const canApprove = currentUser.role === 'admin' && isPending;

        const canBorrow = canUserBorrowItem(item, currentUser.role) && item.quantity > 0;
        const canIssue = canUserIssueItem(item, currentUser.role) && item.quantity > 0;
        const canRequest = (currentUser.role === 'student' || currentUser.role === 'faculty') && (canBorrow || canIssue);

        const availabilityBadges = [];
        if (item.isBorrowable && Array.isArray(item.borrowableBy) && item.borrowableBy.length > 0) {
            const borrowText = item.borrowableBy.join(', ');
            availabilityBadges.push(`<span class="badge-borrowable" title="Borrowable by: ${borrowText}">Borrowable</span>`);
        }
        if (item.isIssuable && Array.isArray(item.issuableBy) && item.issuableBy.length > 0) {
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
                    ${isPending ? '<span class="status-badge status-pending" style="margin-left: 8px;">Pending Approval</span>' : ''}
                    ${isRejected ? '<span class="status-badge status-rejected" style="margin-left: 8px;">Rejected</span>' : ''}
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
                    ${canApprove ? `
                        <button class="btn-success" onclick="approveItem(${item.id})">Approve</button>
                        <button class="btn-danger" onclick="rejectItem(${item.id})">Reject</button>
                    ` : ''}
                    ${canEdit ? `
                        <button class="btn-primary" onclick="openEditModal(${item.id})">Edit</button>
                    ` : ''}
                    ${canDelete ? `
                        <button class="btn-danger" onclick="deleteItem(${item.id})">Delete</button>
                    ` : ''}
                    ${!isPending && !isRejected ? requestButtons : ''}
                    ${!canEdit && !canRequest && !canApprove ? `
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

    if (Array.isArray(item.borrowableBy)) {
        document.querySelectorAll('input[name="borrowableBy"]').forEach(checkbox => {
            checkbox.checked = item.borrowableBy.includes(checkbox.value);
        });
    }

    if (Array.isArray(item.issuableBy)) {
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

async function handleItemSubmit(e) {
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

    try {
        if (itemId) {
            await API.updateItem(parseInt(itemId), itemData);
            if (currentUser.role === 'staff') {
                alert('Item updated successfully! Changes are pending admin approval.');
            } else {
                alert('Item updated successfully!');
            }
        } else {
            await API.createItem(itemData);
            if (currentUser.role === 'staff') {
                alert('Item added successfully! Waiting for admin approval before it goes live.');
            } else {
                alert('Item added successfully!');
            }
        }

        document.getElementById('itemModal').style.display = 'none';
        await loadItems();
        applyFilters();
    } catch (error) {
        console.error('Error saving item:', error);
        alert('Failed to save item: ' + error.message);
    }
}

async function handleCheckoutSubmit(e) {
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

    const transactionData = {
        itemId: itemId,
        quantity: quantity,
        transactionType: transactionType,
        reason: reason
    };

    try {
        await API.createTransaction(transactionData);
        const actionText = transactionType === 'borrow' ? 'borrow' : 'issue';
        alert(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} request submitted successfully! Waiting for approval.`);
        document.getElementById('checkoutModal').style.display = 'none';
    } catch (error) {
        console.error('Error creating transaction:', error);
        alert('Failed to submit request: ' + error.message);
    }
}

async function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
        await API.deleteItem(itemId);
        alert('Item deleted successfully!');
        await loadItems();
        applyFilters();
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item: ' + error.message);
    }
}

async function approveItem(itemId) {
    if (currentUser.role !== 'admin') {
        alert('Only admins can approve items.');
        return;
    }

    if (!confirm('Approve this item to make it live in the inventory?')) return;

    try {
        await API.approveItem(itemId);
        alert('Item approved successfully! It is now live in the inventory.');
        await loadItems();
        applyFilters();
    } catch (error) {
        console.error('Error approving item:', error);
        alert('Failed to approve item: ' + error.message);
    }
}

async function rejectItem(itemId) {
    if (currentUser.role !== 'admin') {
        alert('Only admins can reject items.');
        return;
    }

    const reason = prompt('Enter rejection reason (optional):');
    if (reason === null) return;

    try {
        await API.deleteItem(itemId);
        alert('Item rejected.');
        await loadItems();
        applyFilters();
    } catch (error) {
        console.error('Error rejecting item:', error);
        alert('Failed to reject item: ' + error.message);
    }
}

async function openAddCategoryModal() {
    const categoryName = prompt('Enter new category name:');
    if (!categoryName || categoryName.trim() === '') return;

    const exists = CATEGORIES.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
    if (exists) {
        alert('Category already exists!');
        return;
    }

    const description = prompt('Enter category description (optional):');

    const newCategory = {
        name: categoryName.trim(),
        description: description || ''
    };

    try {
        const createdCategory = await API.createCategory(newCategory);
        CATEGORIES.push(createdCategory);
        alert('Category created successfully!');
        loadFilters();
    } catch (error) {
        console.error('Error creating category:', error);
        alert('Failed to create category: ' + error.message);
    }
}

async function openAddDepartmentModal() {
    const departmentName = prompt('Enter new department name:');
    if (!departmentName || departmentName.trim() === '') return;

    const exists = DEPARTMENTS.find(d => d.name.toLowerCase() === departmentName.toLowerCase());
    if (exists) {
        alert('Department already exists!');
        return;
    }

    const description = prompt('Enter department description (optional):');

    const newDepartment = {
        name: departmentName.trim(),
        description: description || ''
    };

    try {
        const createdDepartment = await API.createDepartment(newDepartment);
        DEPARTMENTS.push(createdDepartment);
        alert('Department created successfully!');
        loadFilters();
    } catch (error) {
        console.error('Error creating department:', error);
        alert('Failed to create department: ' + error.message);
    }
}

function getItemById(itemId) {
    return allItems.find(item => item.id === itemId);
}
