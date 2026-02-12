// --- Panel de Estadísticas y Reportes ---
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') { window.location.href = 'index.html'; return; }
    const app = document.getElementById('reportesApp');
    if (!app) return;

    function render() {
        const productos = Storage.getProductos();
        const movimientos = Storage.getMovimientos();
        // Productos con bajo stock
        const bajoStock = productos.filter(p=>p.stock<=5);
        // Productos con más movimientos
        const movCount = {};
        for (const m of movimientos) {
            movCount[m.producto] = (movCount[m.producto]||0)+1;
        }
        const masMov = Object.entries(movCount).sort((a,b)=>b[1]-a[1]).slice(0,5);
        let html = `<h2>Panel de Estadísticas</h2>`;
        html += `<div class="row">
            <div class="col-md-6">
                <h4>Productos con Bajo Stock (≤5)</h4>
                <ul class="list-group mb-3">${bajoStock.length?bajoStock.map(p=>`<li class="list-group-item d-flex justify-content-between align-items-center">${p.nombre}<span class="badge bg-danger">${p.stock}</span></li>`).join(''):'<li class="list-group-item">Ninguno</li>'}</ul>
            </div>
            <div class="col-md-6">
                <h4>Productos con Más Movimientos</h4>
                <ul class="list-group mb-3">${masMov.length?masMov.map(([nombre,cant])=>`<li class="list-group-item d-flex justify-content-between align-items-center">${nombre}<span class="badge bg-primary">${cant}</span></li>`).join(''):'<li class="list-group-item">Ninguno</li>'}</ul>
            </div>
        </div>`;
        html += `<h4 class="mt-4">Historial Completo de Movimientos</h4>`;
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
    }

    render();
});
