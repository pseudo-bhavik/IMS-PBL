let currentUser = null;
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

    if (currentUser.role !== 'admin' && currentUser.role !== 'staff') {
        alert('You do not have permission to access this page.');
        window.location.href = 'dashboard.html';
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

    setupModals();
    await loadData();
    loadCategories();
    loadDepartments();
});

async function loadData() {
    try {
        [CATEGORIES, DEPARTMENTS] = await Promise.all([
            API.getCategories(),
            API.getDepartments()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load categories and departments');
        CATEGORIES = [];
        DEPARTMENTS = [];
    }
}

function setupModals() {
    const categoryModal = document.getElementById('categoryModal');
    const departmentModal = document.getElementById('departmentModal');
    const categoryForm = document.getElementById('categoryForm');
    const departmentForm = document.getElementById('departmentForm');

    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            categoryModal.style.display = 'none';
            departmentModal.style.display = 'none';
        });
    });

    document.getElementById('cancelCategoryBtn').addEventListener('click', function() {
        categoryModal.style.display = 'none';
    });

    document.getElementById('cancelDepartmentBtn').addEventListener('click', function() {
        departmentModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === categoryModal) categoryModal.style.display = 'none';
        if (e.target === departmentModal) departmentModal.style.display = 'none';
    });

    categoryForm.addEventListener('submit', handleCategorySubmit);
    departmentForm.addEventListener('submit', handleDepartmentSubmit);
}

function loadCategories() {
    const list = document.getElementById('categoriesList');

    if (CATEGORIES.length === 0) {
        list.innerHTML = '<p class="no-data">No categories found</p>';
        return;
    }

    list.innerHTML = CATEGORIES.map(cat => `
        <div class="activity-item">
            <strong>${cat.name}</strong>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
                <button class="btn-primary" style="padding: 6px 12px;" onclick="editCategory(${cat.id})">Edit</button>
                <button class="btn-danger" style="padding: 6px 12px;" onclick="deleteCategory(${cat.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function loadDepartments() {
    const list = document.getElementById('departmentsList');

    if (DEPARTMENTS.length === 0) {
        list.innerHTML = '<p class="no-data">No departments found</p>';
        return;
    }

    list.innerHTML = DEPARTMENTS.map(dept => `
        <div class="activity-item">
            <strong>${dept.name}</strong>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
                <button class="btn-primary" style="padding: 6px 12px;" onclick="editDepartment(${dept.id})">Edit</button>
                <button class="btn-danger" style="padding: 6px 12px;" onclick="deleteDepartment(${dept.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function openAddCategoryModal() {
    document.getElementById('categoryModalTitle').textContent = 'Add Category';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryModal').style.display = 'block';
}

function editCategory(categoryId) {
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;

    document.getElementById('categoryModalTitle').textContent = 'Edit Category';
    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryModal').style.display = 'block';
}

async function deleteCategory(categoryId) {
    try {
        const items = await API.getItems();
        const itemsUsingCategory = items.filter(item => item.categoryId === categoryId);

        if (itemsUsingCategory.length > 0) {
            alert(`Cannot delete this category. ${itemsUsingCategory.length} item(s) are using it. Please reassign or delete those items first.`);
            return;
        }

        if (!confirm('Are you sure you want to delete this category?')) return;

        await API.deleteCategory(categoryId);
        alert('Category deleted successfully!');
        await loadData();
        loadCategories();
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category: ' + error.message);
    }
}

async function handleCategorySubmit(e) {
    e.preventDefault();

    const categoryId = document.getElementById('categoryId').value;
    const categoryName = document.getElementById('categoryName').value.trim();

    if (!categoryName) {
        alert('Please enter a category name');
        return;
    }

    try {
        if (categoryId) {
            alert('Category editing not yet implemented');
        } else {
            await API.createCategory({ name: categoryName });
            alert('Category added successfully!');
            await loadData();
            loadCategories();
        }
        document.getElementById('categoryModal').style.display = 'none';
    } catch (error) {
        console.error('Error saving category:', error);
        alert('Failed to save category: ' + error.message);
    }
}

function openAddDepartmentModal() {
    document.getElementById('departmentModalTitle').textContent = 'Add Department';
    document.getElementById('departmentForm').reset();
    document.getElementById('departmentId').value = '';
    document.getElementById('departmentModal').style.display = 'block';
}

function editDepartment(departmentId) {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    if (!department) return;

    document.getElementById('departmentModalTitle').textContent = 'Edit Department';
    document.getElementById('departmentId').value = department.id;
    document.getElementById('departmentName').value = department.name;
    document.getElementById('departmentModal').style.display = 'block';
}

async function deleteDepartment(departmentId) {
    try {
        const items = await API.getItems();
        const itemsUsingDepartment = items.filter(item => item.departmentId === departmentId);

        if (itemsUsingDepartment.length > 0) {
            alert(`Cannot delete this department. ${itemsUsingDepartment.length} item(s) are using it. Please reassign or delete those items first.`);
            return;
        }

        if (!confirm('Are you sure you want to delete this department?')) return;

        await API.deleteDepartment(departmentId);
        alert('Department deleted successfully!');
        await loadData();
        loadDepartments();
    } catch (error) {
        console.error('Error deleting department:', error);
        alert('Failed to delete department: ' + error.message);
    }
}

async function handleDepartmentSubmit(e) {
    e.preventDefault();

    const departmentId = document.getElementById('departmentId').value;
    const departmentName = document.getElementById('departmentName').value.trim();

    if (!departmentName) {
        alert('Please enter a department name');
        return;
    }

    try {
        if (departmentId) {
            alert('Department editing not yet implemented');
        } else {
            await API.createDepartment({ name: departmentName });
            alert('Department added successfully!');
            await loadData();
            loadDepartments();
        }
        document.getElementById('departmentModal').style.display = 'none';
    } catch (error) {
        console.error('Error saving department:', error);
        alert('Failed to save department: ' + error.message);
    }
}
