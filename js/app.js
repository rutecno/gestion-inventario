// --- Login Simulado y Redirección según rol ---
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const role = document.getElementById('role').value;
            if (username) {
                localStorage.setItem('user', JSON.stringify({ username, role }));
                window.location.href = 'dashboard.html';
            }
        });
    }
});
