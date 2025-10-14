const API = {
    async request(endpoint, options = {}) {
        if (USE_MOCK_DATA) {
            // Return mock data for testing
            return this.getMockData(endpoint, options);
        }

        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        // Merge options and ensure credentials is always included
        const fetchOptions = {
            ...defaultOptions,
            ...options,
            credentials: 'include'
        };

        try {
            const response = await fetch(url, fetchOptions);

            if (!response.ok) {
                if (response.status === 401) {
                    console.error('Authentication failed - clearing session and redirecting to login');
                    sessionStorage.removeItem('currentUser');
                    window.location.href = 'index.html';
                    throw new Error('Not authenticated');
                }
                const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Request failed');
            }

            return data.data || data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    getMockData(endpoint, options) {
        // Mock data responses for testing
        if (endpoint === API_CONFIG.ENDPOINTS.ITEMS) {
            return Promise.resolve(INVENTORY_ITEMS);
        } else if (endpoint === API_CONFIG.ENDPOINTS.TRANSACTIONS) {
            return Promise.resolve(TRANSACTIONS);
        } else if (endpoint.includes('/dashboard')) {
            return Promise.resolve({
                totalItems: INVENTORY_ITEMS.length,
                lowStockItems: INVENTORY_ITEMS.filter(item => item.quantity < 10).length,
                pendingTransactions: TRANSACTIONS.filter(t => t.status === 'pending').length
            });
        }
        return Promise.resolve([]);
    },

    async getStats() {
        return await this.request(API_CONFIG.ENDPOINTS.DASHBOARD);
    },

    async getItems(filters = {}) {
        const params = new URLSearchParams(filters);
        const query = params.toString() ? `?${params.toString()}` : '';
        const items = await this.request(`${API_CONFIG.ENDPOINTS.ITEMS}${query}`);

        // Parse JSON strings to arrays for borrowableBy and issuableBy
        return items.map(item => ({
            ...item,
            borrowableBy: this.parseJsonField(item.borrowableBy),
            issuableBy: this.parseJsonField(item.issuableBy)
        }));
    },

    async getItemById(id) {
        const item = await this.request(`${API_CONFIG.ENDPOINTS.ITEMS}/${id}`);

        // Parse JSON strings to arrays for borrowableBy and issuableBy
        return {
            ...item,
            borrowableBy: this.parseJsonField(item.borrowableBy),
            issuableBy: this.parseJsonField(item.issuableBy)
        };
    },

    async getLowStockItems() {
        const items = await this.request(`${API_CONFIG.ENDPOINTS.ITEMS}/low-stock`);

        // Parse JSON strings to arrays for borrowableBy and issuableBy
        return items.map(item => ({
            ...item,
            borrowableBy: this.parseJsonField(item.borrowableBy),
            issuableBy: this.parseJsonField(item.issuableBy)
        }));
    },

    parseJsonField(field) {
        // Handle null, undefined, or already-array values
        if (!field) return [];
        if (Array.isArray(field)) return field;

        // Parse JSON string
        try {
            const parsed = JSON.parse(field);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.warn('Failed to parse JSON field:', field);
            return [];
        }
    },

    async createItem(item) {
        // Convert arrays to JSON strings for backend
        const itemPayload = {
            ...item,
            borrowableBy: item.borrowableBy ? JSON.stringify(item.borrowableBy) : null,
            issuableBy: item.issuableBy ? JSON.stringify(item.issuableBy) : null
        };

        return await this.request(API_CONFIG.ENDPOINTS.ITEMS, {
            method: 'POST',
            body: JSON.stringify(itemPayload)
        });
    },

    async updateItem(id, item) {
        // Convert arrays to JSON strings for backend
        const itemPayload = {
            ...item,
            borrowableBy: item.borrowableBy ? JSON.stringify(item.borrowableBy) : null,
            issuableBy: item.issuableBy ? JSON.stringify(item.issuableBy) : null
        };

        return await this.request(`${API_CONFIG.ENDPOINTS.ITEMS}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(itemPayload)
        });
    },

    async approveItem(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.ITEMS}/${id}/approve`, {
            method: 'POST'
        });
    },

    async deleteItem(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.ITEMS}/${id}`, {
            method: 'DELETE'
        });
    },

    async getTransactions(filters = {}) {
        const params = new URLSearchParams(filters);
        const query = params.toString() ? `?${params.toString()}` : '';
        return await this.request(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}${query}`);
    },

    async getTransactionById(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}`);
    },

    async createTransaction(transaction) {
        return await this.request(API_CONFIG.ENDPOINTS.TRANSACTIONS, {
            method: 'POST',
            body: JSON.stringify(transaction)
        });
    },

    async approveTransaction(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}/approve`, {
            method: 'POST'
        });
    },

    async returnItem(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}/return`, {
            method: 'POST'
        });
    },

    async deleteTransaction(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}`, {
            method: 'DELETE'
        });
    },

    async getCategories() {
        return await this.request(API_CONFIG.ENDPOINTS.CATEGORIES);
    },

    async createCategory(category) {
        return await this.request(API_CONFIG.ENDPOINTS.CATEGORIES, {
            method: 'POST',
            body: JSON.stringify(category)
        });
    },

    async updateCategory(id, category) {
        return await this.request(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(category)
        });
    },

    async deleteCategory(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`, {
            method: 'DELETE'
        });
    },

    async getDepartments() {
        return await this.request(API_CONFIG.ENDPOINTS.DEPARTMENTS);
    },

    async createDepartment(department) {
        return await this.request(API_CONFIG.ENDPOINTS.DEPARTMENTS, {
            method: 'POST',
            body: JSON.stringify(department)
        });
    },

    async updateDepartment(id, department) {
        return await this.request(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(department)
        });
    },

    async deleteDepartment(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`, {
            method: 'DELETE'
        });
    },

    async getUsers() {
        return await this.request(API_CONFIG.ENDPOINTS.USERS);
    }
};