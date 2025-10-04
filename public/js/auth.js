// Authentication Logic

// Check auth immediately before DOM loads to prevent flicker
(function() {
    const currentUser = getCurrentUser();
    if (currentUser && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    // Show page after auth check
    document.body.classList.add('loaded');

    const loginForm = document.getElementById('loginForm');

    if (!loginForm) return;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        // Find user
        const user = USERS.find(u =>
            u.username === username &&
            u.password === password &&
            u.role === role
        );

        if (user) {
            // Store user session
            setCurrentUser(user);

            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid credentials! Please check username, password, and role.');
        }
    });
});
