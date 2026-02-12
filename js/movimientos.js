// --- Registro y Visualización de Movimientos ---
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) { window.location.href = 'index.html'; return; }
    const app = document.getElementById('movimientosApp');
    if (!app) return;

    function render() {
        const productos = Storage.getProductos();
        const movimientos = Storage.getMovimientos();
        let html = '';
        if (user.role === 'admin' || user.role === 'employee') {
            html += `<div class="d-flex justify-content-between align-items-center mb-3">
                <h2>Movimientos</h2>
                <button class="btn btn-success" id="btnAddMov">Registrar Movimiento</button>
            </div>`;
        }
        html += `<table class="table table-striped"><thead><tr><th>Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th>Usuario</th></tr></thead><tbody>`;
        for (const m of movimientos.sort((a,b)=>b.fecha-a.fecha)) {
            html += `<tr>
                <td>${new Date(m.fecha).toLocaleString()}</td>
                <td>${m.producto}</td>
                <td>${m.tipo==='entrada'?'Entrada':'Salida'}</td>
                <td>${m.cantidad}</td>
                <td>${m.usuario}</td>
            </tr>`;
        }
        html += `</tbody></table>`;
        app.innerHTML = html;
        bindEvents();
    }

    function bindEvents() {
        const btnAddMov = document.getElementById('btnAddMov');
        if (btnAddMov) btnAddMov.onclick = showForm;
    }

    function showForm() {
        const productos = Storage.getProductos();
        app.innerHTML = `<h3>Registrar Movimiento</h3>
        <form id="movForm">
            <div class="mb-2"><label>Producto</label><select class="form-select" id="producto" required>${productos.map(p=>`<option value="${p.id}">${p.nombre}</option>`).join('')}</select></div>
            <div class="mb-2"><label>Tipo</label><select class="form-select" id="tipo" required><option value="entrada">Entrada</option><option value="salida">Salida</option></select></div>
            <div class="mb-2"><label>Cantidad</label><input type="number" class="form-control" id="cantidad" min="1" required></div>
            <button class="btn btn-primary mt-2">Registrar</button>
            <button class="btn btn-secondary mt-2 ms-2" id="cancelar">Cancelar</button>
        </form>`;
        document.getElementById('movForm').onsubmit = function(e) {
            e.preventDefault();
            const productoId = document.getElementById('producto').value;
            const tipo = document.getElementById('tipo').value;
            const cantidad = parseInt(document.getElementById('cantidad').value);
            let productos = Storage.getProductos();
            const idx = productos.findIndex(p=>p.id==productoId);
            if (idx===-1) return;
            if (tipo==='entrada') {
                productos[idx].stock += cantidad;
            } else {
                if (productos[idx].stock < cantidad) {
                    alert('Stock insuficiente');
                    return;
                }
                productos[idx].stock -= cantidad;
            }
            Storage.setProductos(productos);
            // Registrar movimiento
            let movimientos = Storage.getMovimientos();
            movimientos.push({
                fecha: Date.now(),
                producto: productos[idx].nombre,
                tipo,
                cantidad,
                usuario: user.username
            });
            Storage.setMovimientos(movimientos);
            render();
        };
        document.getElementById('cancelar').onclick = function(e) { e.preventDefault(); render(); };
    }

    render();
});
