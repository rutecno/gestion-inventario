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
        const rolBadge = user.role === 'admin' ? 
            '<span class="badge bg-danger ms-2">Administrador</span>' : 
            '<span class="badge bg-info ms-2">Empleado</span>';
        userInfo.innerHTML = `<i class="bi bi-person-circle"></i> ${user.nombre} ${user.apellido} ${rolBadge}`;
    }

    // Navegación según rol
    if (navLinks) {
        navLinks.innerHTML = '';
        if (user.role === 'admin') {
            navLinks.innerHTML += '<li class="nav-item"><a class="nav-link" href="productos.html"><i class="bi bi-box-fill"></i> Productos</a></li>';
            navLinks.innerHTML += '<li class="nav-item"><a class="nav-link" href="movimientos.html"><i class="bi bi-arrow-left-right"></i> Movimientos</a></li>';
            navLinks.innerHTML += '<li class="nav-item"><a class="nav-link" href="reportes.html"><i class="bi bi-bar-chart-fill"></i> Reportes</a></li>';
            navLinks.innerHTML += '<li class="nav-item"><a class="nav-link" href="cargar-datos.html"><i class="bi bi-cloud-download-fill"></i> Cargar Datos</a></li>';
            navLinks.innerHTML += '<li class="nav-item"><a class="nav-link" href="user-management.html"><i class="bi bi-people-fill"></i> Usuarios</a></li>';
        } else {
            navLinks.innerHTML += '<li class="nav-item"><a class="nav-link" href="movimientos.html"><i class="bi bi-arrow-left-right"></i> Movimientos</a></li>';
            navLinks.innerHTML += '<li class="nav-item"><a class="nav-link" href="productos.html"><i class="bi bi-box-fill"></i> Inventario</a></li>';
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
        const horaActual = new Date().getHours();
        let saludo = 'Bienvenido';
        if (horaActual < 12) saludo = 'Buenos días';
        else if (horaActual < 18) saludo = 'Buenas tardes';
        else saludo = 'Buenas noches';
        
        mainContent.innerHTML = `<div class="text-center py-5">
            <h1><i class="bi bi-speedometer2"></i> ${saludo}, ${user.nombre}!</h1>
            <p class="lead text-muted mt-3">Bienvenido al Sistema de Gestión de Inventario</p>
            <div class="mt-5">
                ${user.role === 'admin' ? 
                    `<p>Como administrador, puedes:</p>
                    <div class="row mt-4">
                        <div class="col-md-3">
                            <div class="card hover-shadow">
                                <div class="card-body">
                                    <i class="bi bi-box-fill fs-1 text-primary"></i>
                                    <h5 class="mt-3">Productos</h5>
                                    <p class="small text-muted">Gestionar inventario</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card hover-shadow">
                                <div class="card-body">
                                    <i class="bi bi-arrow-left-right fs-1 text-success"></i>
                                    <h5 class="mt-3">Movimientos</h5>
                                    <p class="small text-muted">Registrar entradas/salidas</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card hover-shadow">
                                <div class="card-body">
                                    <i class="bi bi-bar-chart-fill fs-1 text-info"></i>
                                    <h5 class="mt-3">Reportes</h5>
                                    <p class="small text-muted">Ver estadísticas</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card hover-shadow">
                                <div class="card-body">
                                    <i class="bi bi-people-fill fs-1" style="color:#6f42c1;"></i>
                                    <h5 class="mt-3">Usuarios</h5>
                                    <p class="small text-muted">Gestionar roles</p>
                                </div>
                            </div>
                        </div>
                    </div>` : 
                    `<p>Como empleado, puedes:</p>
                    <div class="row mt-4">
                        <div class="col-md-6">
                            <div class="card hover-shadow">
                                <div class="card-body">
                                    <i class="bi bi-box-fill fs-1 text-primary"></i>
                                    <h5 class="mt-3">Ver Inventario</h5>
                                    <p class="small text-muted">Consultar productos disponibles</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card hover-shadow">
                                <div class="card-body">
                                    <i class="bi bi-arrow-left-right fs-1 text-success"></i>
                                    <h5 class="mt-3">Movimientos</h5>
                                    <p class="small text-muted">Registrar transacciones</p>
                                </div>
                            </div>
                        </div>
                    </div>`
                }
            </div>
        </div>`;
    }
});

