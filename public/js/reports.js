// Reports Logic

let currentUser = null;
let currentReportData = null;
let currentReportType = null;

document.addEventListener('DOMContentLoaded', function() {
    currentUser = checkAuth();
    if (!currentUser) return;

    if (currentUser.role !== 'admin' && currentUser.role !== 'staff') {
        alert('Access denied. Only admins and staff can generate reports.');
        window.location.href = 'dashboard.html';
        return;
    }

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

    loadFilters();

    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    document.getElementById('startDate').value = thirtyDaysAgo;
    document.getElementById('endDate').value = today;
});

function loadFilters() {
    const departmentFilter = document.getElementById('reportDepartment');
    const categoryFilter = document.getElementById('reportCategory');

    DEPARTMENTS.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id;
        option.textContent = dept.name;
        departmentFilter.appendChild(option);
    });

    CATEGORIES.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categoryFilter.appendChild(option);
    });
}

function generateReport() {
    const reportType = document.getElementById('reportType').value;
    if (!reportType) {
        alert('Please select a report type');
        return;
    }

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const departmentId = parseInt(document.getElementById('reportDepartment').value) || null;
    const categoryId = parseInt(document.getElementById('reportCategory').value) || null;

    currentReportType = reportType;
    let reportData = null;
    let reportTitle = '';

    switch (reportType) {
        case 'inventory':
            reportData = generateInventoryReport(departmentId, categoryId);
            reportTitle = 'Inventory Summary Report';
            break;
        case 'transactions':
            reportData = generateTransactionReport(startDate, endDate, departmentId);
            reportTitle = 'Transaction History Report';
            break;
        case 'borrowed':
            reportData = generateBorrowedItemsReport(startDate, endDate);
            reportTitle = 'Borrowed Items Report';
            break;
        case 'issued':
            reportData = generateIssuedItemsReport(startDate, endDate);
            reportTitle = 'Issued Items Report';
            break;
        case 'lowstock':
            reportData = generateLowStockReport(departmentId);
            reportTitle = 'Low Stock Alert Report';
            break;
        case 'department':
            reportData = generateDepartmentReport(departmentId);
            reportTitle = 'Department-wise Inventory Report';
            break;
    }

    currentReportData = reportData;

    displayReport(reportTitle, reportData);

    document.getElementById('pdfBtn').style.display = 'inline-block';
    document.getElementById('csvBtn').style.display = 'inline-block';
}

function generateInventoryReport(departmentId, categoryId) {
    let items = [...INVENTORY_ITEMS];

    if (departmentId) {
        items = items.filter(item => item.departmentId === departmentId);
    }

    if (categoryId) {
        items = items.filter(item => item.categoryId === categoryId);
    }

    return items.map(item => ({
        'Item Name': item.name,
        'Category': getCategoryName(item.categoryId),
        'Department': getDepartmentName(item.departmentId),
        'Available Quantity': item.quantity,
        'Total Quantity': item.totalQuantity,
        'Status': getStatusText(getItemStatus(item)),
        'Borrowable': item.isBorrowable ? 'Yes' : 'No',
        'Issuable': item.isIssuable ? 'Yes' : 'No'
    }));
}

function generateTransactionReport(startDate, endDate, departmentId) {
    let transactions = [...TRANSACTIONS];

    if (startDate) {
        transactions = transactions.filter(t => t.requestDate >= startDate);
    }

    if (endDate) {
        transactions = transactions.filter(t => t.requestDate <= endDate);
    }

    if (departmentId) {
        transactions = transactions.filter(t => {
            const item = getItemById(t.itemId);
            return item.departmentId === departmentId;
        });
    }

    return transactions.map(t => {
        const item = getItemById(t.itemId);
        const user = getUserById(t.userId);
        return {
            'Transaction ID': `#${t.id}`,
            'Item': item.name,
            'User': user.name,
            'Type': getTypeText(t.transactionType),
            'Quantity': t.quantity,
            'Request Date': formatDate(t.requestDate),
            'Status': getStatusText(t.status),
            'Approved Date': t.approvedDate ? formatDate(t.approvedDate) : '-'
        };
    });
}

function generateBorrowedItemsReport(startDate, endDate) {
    let transactions = TRANSACTIONS.filter(t =>
        t.transactionType === 'borrow' &&
        (t.status === 'approved' || t.status === 'returned')
    );

    if (startDate) {
        transactions = transactions.filter(t => t.requestDate >= startDate);
    }

    if (endDate) {
        transactions = transactions.filter(t => t.requestDate <= endDate);
    }

    return transactions.map(t => {
        const item = getItemById(t.itemId);
        const user = getUserById(t.userId);
        return {
            'Item': item.name,
            'Borrowed By': user.name,
            'Quantity': t.quantity,
            'Borrowed Date': formatDate(t.approvedDate),
            'Return Date': t.return_date ? formatDate(t.return_date) : 'Not Returned',
            'Status': getStatusText(t.status),
            'Department': getDepartmentName(item.departmentId)
        };
    });
}

function generateIssuedItemsReport(startDate, endDate) {
    let transactions = TRANSACTIONS.filter(t =>
        t.transactionType === 'issue' &&
        t.status === 'issued'
    );

    if (startDate) {
        transactions = transactions.filter(t => t.requestDate >= startDate);
    }

    if (endDate) {
        transactions = transactions.filter(t => t.requestDate <= endDate);
    }

    return transactions.map(t => {
        const item = getItemById(t.itemId);
        const user = getUserById(t.userId);
        return {
            'Item': item.name,
            'Issued To': user.name,
            'User Role': user.role,
            'Quantity': t.quantity,
            'Issue Date': formatDate(t.approvedDate),
            'Department': getDepartmentName(item.departmentId),
            'Reason': t.reason
        };
    });
}

function generateLowStockReport(departmentId) {
    let items = INVENTORY_ITEMS.filter(item => {
        const status = getItemStatus(item);
        return status === 'low' || status === 'out';
    });

    if (departmentId) {
        items = items.filter(item => item.departmentId === departmentId);
    }

    return items.map(item => ({
        'Item Name': item.name,
        'Category': getCategoryName(item.categoryId),
        'Department': getDepartmentName(item.departmentId),
        'Available Quantity': item.quantity,
        'Total Quantity': item.totalQuantity,
        'Status': getStatusText(getItemStatus(item)),
        'Percentage': `${Math.round((item.quantity / item.totalQuantity) * 100)}%`
    }));
}

function generateDepartmentReport(departmentId) {
    const departments = departmentId ? [DEPARTMENTS.find(d => d.id === departmentId)] : DEPARTMENTS;

    const reportData = [];
    departments.forEach(dept => {
        const items = INVENTORY_ITEMS.filter(item => item.departmentId === dept.id);
        const totalItems = items.length;
        const totalQuantity = items.reduce((sum, item) => sum + item.totalQuantity, 0);
        const availableQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const lowStockItems = items.filter(item => getItemStatus(item) === 'low').length;

        reportData.push({
            'Department': dept.name,
            'Total Items': totalItems,
            'Total Quantity': totalQuantity,
            'Available Quantity': availableQuantity,
            'Low Stock Items': lowStockItems
        });
    });

    return reportData;
}

function displayReport(title, data) {
    document.getElementById('reportTitle').textContent = title;
    document.getElementById('reportDate').textContent = `Generated on: ${new Date().toLocaleString()}`;
    document.getElementById('reportPreview').style.display = 'block';

    if (data.length === 0) {
        document.getElementById('reportContent').innerHTML = '<p class="no-data">No data available for the selected filters</p>';
        return;
    }

    const headers = Object.keys(data[0]);
    let tableHTML = `
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        ${headers.map(h => `<th>${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            ${headers.map(h => `<td>${row[h]}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('reportContent').innerHTML = tableHTML;
}

function exportToPDF() {
    if (!currentReportData || currentReportData.length === 0) {
        alert('No data to export');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const reportTitle = document.getElementById('reportTitle').textContent;
    const reportDate = document.getElementById('reportDate').textContent;

    doc.setFontSize(18);
    doc.setTextColor(165, 13, 35);
    doc.text('KJSIT Inventory Management System', 14, 20);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(reportTitle, 14, 30);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(reportDate, 14, 38);

    const headers = Object.keys(currentReportData[0]);
    const rows = currentReportData.map(row => headers.map(h => row[h]));

    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 45,
        theme: 'grid',
        headStyles: {
            fillColor: [165, 13, 35],
            textColor: 255,
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 9,
            cellPadding: 3
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        }
    });

    const fileName = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}

function exportToCSV() {
    if (!currentReportData || currentReportData.length === 0) {
        alert('No data to export');
        return;
    }

    const headers = Object.keys(currentReportData[0]);
    let csvContent = headers.join(',') + '\n';

    currentReportData.forEach(row => {
        const values = headers.map(header => {
            let value = row[header].toString();
            value = value.replace(/"/g, '""');
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                value = `"${value}"`;
            }
            return value;
        });
        csvContent += values.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const reportTitle = document.getElementById('reportTitle').textContent;
    const fileName = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
