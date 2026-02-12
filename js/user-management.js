// --- Gestión de Usuarios y Roles ---
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') { 
        window.location.href = 'index.html'; 
        return; 
    }
    
    const app = document.getElementById('usersApp');
    if (!app) return;

    function render() {
        const usuarios = Storage.getUsuarios();
        let html = '<h3 class="mb-4"><i class="bi bi-people-fill"></i> Gestión de Usuarios</h3>';
        
        if (usuarios.length === 0) {
            html += `<div class="alert alert-info">
                <i class="bi bi-info-circle"></i> No hay usuarios registrados
            </div>`;
        } else {
            html += '<div class="table-responsive"><table class="table table-hover"><thead><tr>';
            html += '<th><i class="bi bi-at"></i> Usuario</th>';
            html += '<th><i class="bi bi-person"></i> Nombre</th>';
            html += '<th><i class="bi bi-card-text"></i> Cédula</th>';
            html += '<th><i class="bi bi-envelope"></i> Email</th>';
            html += '<th><i class="bi bi-shield-fill"></i> Rol</th>';
            html += '<th>Acciones</th></tr></thead><tbody>';
            
            for (const u of usuarios) {
                const rolBadge = u.role === 'admin' ? 'bg-danger' : 'bg-info';
                const rolTexto = u.role === 'admin' ? 'Administrador' : 'Empleado';
                
                html += `<tr>
                    <td><strong>${u.usuario}</strong></td>
                    <td>${u.nombre} ${u.apellido}</td>
                    <td>${u.cedula}</td>
                    <td><small>${u.email}</small></td>
                    <td><span class="badge ${rolBadge}">${rolTexto}</span></td>
                    <td>${u.id === user.id ? 
                        '<span class="text-muted small"><i class="bi bi-lock-fill"></i> Tu cuenta</span>' : 
                        `<select class="form-select form-select-sm" onchange="cambiarRol('${u.id}', this.value)" style="max-width: 150px;">
                            <option value="employee" ${u.role === 'employee' ? 'selected' : ''}>Empleado</option>
                            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Administrador</option>
                        </select>`}
                    </td>
                </tr>`;
            }
            
            html += '</tbody></table></div>';
        }
        
        app.innerHTML = html;
    }

    window.cambiarRol = function(usuarioId, nuevoRol) {
        const usuarios = Storage.getUsuarios();
        const idx = usuarios.findIndex(u => u.id == usuarioId);
        if (idx !== -1) {
            const usuarioAntiguo = usuarios[idx];
            usuarios[idx].role = nuevoRol;
            Storage.setUsuarios(usuarios);
            
            const titulo = nuevoRol === 'admin' ? 'Administrador' : 'Empleado';
            alert(`✓ Rol de ${usuarioAntiguo.nombre} actualizado a ${titulo}`);
            render();
        }
    };

    render();
});
