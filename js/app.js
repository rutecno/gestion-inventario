// --- Login Simulado y Redirección según rol ---
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que el usuario esté autenticado al cargar dashboard
    if (window.location.pathname.includes('dashboard.html') || 
        window.location.pathname.includes('productos.html') || 
        window.location.pathname.includes('movimientos.html') || 
        window.location.pathname.includes('reportes.html') ||
        window.location.pathname.includes('user-management.html')) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            window.location.href = 'index.html';
        }
    }
});

