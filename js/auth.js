// --- Autenticación de Usuarios ---
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // --- Lógica de Login ---
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const usuario = document.getElementById('usuario').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!usuario || !password) {
                alert('Por favor rellena todos los campos');
                return;
            }

            const usuarios = Storage.getUsuarios();
            const usuarioEncontrado = usuarios.find(u => u.usuario === usuario);

            if (!usuarioEncontrado) {
                alert('Usuario no encontrado');
                return;
            }

            if (usuarioEncontrado.password !== password) {
                alert('Contraseña incorrecta');
                return;
            }

            // Login exitoso
            localStorage.setItem('user', JSON.stringify({
                id: usuarioEncontrado.id,
                usuario: usuarioEncontrado.usuario,
                nombre: usuarioEncontrado.nombre,
                apellido: usuarioEncontrado.apellido,
                email: usuarioEncontrado.email,
                cedula: usuarioEncontrado.cedula,
                telefono: usuarioEncontrado.telefono,
                role: usuarioEncontrado.role
            }));
            window.location.href = 'dashboard.html';
        });
    }

    // --- Lógica de Registro ---
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const cedula = document.getElementById('cedula').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const email = document.getElementById('email').value.trim();
            const usuario = document.getElementById('usuario').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!nombre || !apellido || !cedula || !telefono || !email || !usuario || !password) {
                alert('Por favor rellena todos los campos');
                return;
            }

            const usuarios = Storage.getUsuarios();
            
            // Validar que el usuario no exista
            if (usuarios.find(u => u.usuario === usuario)) {
                alert('El usuario ya existe');
                return;
            }

            // Validar que la cédula no exista
            if (usuarios.find(u => u.cedula === cedula)) {
                alert('La cédula ya está registrada');
                return;
            }

            // Crear nuevo usuario con rol por defecto "employee"
            const nuevoUsuario = {
                id: Date.now(),
                nombre,
                apellido,
                cedula,
                telefono,
                email,
                usuario,
                password,
                role: 'employee'
            };

            usuarios.push(nuevoUsuario);
            Storage.setUsuarios(usuarios);

            alert('Cuenta creada exitosamente. Ahora inicia sesión.');
            window.location.href = 'index.html';
        });
    }
});
