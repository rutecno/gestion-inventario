// --- UI Dinámica y Protección de Vistas ---
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navLinks = document.getElementById('navLinks');
    const userInfo = document.getElementById('userInfo');
    const logoutBtn = document.getElementById('logoutBtn');
    const mainContent = document.getElementById('mainContent');

    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Mostrar usuario y rol
    if (userInfo) {
        userInfo.textContent = `${user.username} (${user.role === 'admin' ? 'Administrador' : 'Empleado'})`;
    }

    // Navegación según rol
    if (navLinks) {
        navLinks.innerHTML = '';
        if (user.role === 'admin') {
            navLinks.innerHTML += '<li class="nav-item"><a class="nav-link" href="productos.html">Productos</a></li>';
            navLinks.innerHTML += '<li class="nav-item"><a class="nav-link" href="movimientos.html">Movimientos</a></li>';
            navLinks.innerHTML += '<li class="nav-item"><a class="nav-link" href="reportes.html">Reportes</a></li>';
        } else {
            navLinks.innerHTML += '<li class="nav-item"><a class="nav-link" href="movimientos.html">Movimientos</a></li>';
            navLinks.innerHTML += '<li class="nav-item"><a class="nav-link" href="productos.html">Inventario</a></li>';
        }
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        };
    }

    // Contenido principal de bienvenida
    if (mainContent) {
        mainContent.innerHTML = `<div class="text-center">
            <h1>Bienvenido, ${user.username}</h1>
            <p>Seleccione una opción del menú para comenzar.</p>
        </div>`;
    }
});
