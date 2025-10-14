// Authentication Logic

// Check auth immediately before DOM loads to prevent flicker
(function() {
    const currentUser = getCurrentUser();
    const pathname = window.location.pathname;
    const isLoginPage = pathname.includes('index.html') || pathname.endsWith('/') || pathname === '';

    if (currentUser && isLoginPage) {
        const timestamp = sessionStorage.getItem('loginTimestamp');
        const now = Date.now();

        if (!timestamp || (now - parseInt(timestamp)) > 2000) {
            window.location.href = 'dashboard.html';
        }
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    // Show page after auth check
    document.body.classList.add('loaded');

    const loginForm = document.getElementById('loginForm');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        sessionStorage.setItem('loginTimestamp', Date.now().toString());

        try {
            if (USE_MOCK_DATA) {
                // Mock authentication
                const user = USERS.find(u => u.username === username && u.password === password);
                if (user) {
                    setCurrentUser(user);
                    window.location.href = 'dashboard.html';
                } else {
                    sessionStorage.removeItem('loginTimestamp');
                    alert('Invalid credentials! Please check username and password.');
                }
                return;
            }

            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (result.success && result.data) {
                setCurrentUser(result.data);
                window.location.href = 'dashboard.html';
            } else {
                sessionStorage.removeItem('loginTimestamp');
                alert(result.message || 'Invalid credentials! Please check username and password.');
            }
        } catch (error) {
            console.error('Login error:', error);
            sessionStorage.removeItem('loginTimestamp');
            alert('Login failed. Please try again.');
        }
    });
});