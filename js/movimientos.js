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
        
        html += `<div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="mb-0"><i class="bi bi-arrow-left-right"></i> Movimientos de Inventario</h3>`;
        
        if (user.role === 'admin' || user.role === 'employee') {
            html += `<button class="btn btn-success" id="btnAddMov">
                <i class="bi bi-plus-circle-fill"></i> Registrar Movimiento
            </button>`;
        }
        html += `</div>`;
        
        if (movimientos.length === 0) {
            html += `<div class="alert alert-info text-center">
                <i class="bi bi-inbox"></i> No hay movimientos registrados
            </div>`;
        } else {
            html += `<div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th><i class="bi bi-calendar"></i> Fecha</th>
                            <th><i class="bi bi-box"></i> Producto</th>
                            <th><i class="bi bi-arrow-left-right"></i> Tipo</th>
                            <th><i class="bi bi-hash"></i> Cantidad</th>
                            <th><i class="bi bi-person"></i> Usuario</th>
                        </tr>
                    </thead>
                    <tbody>`;
            
            for (const m of movimientos.sort((a,b)=>b.fecha-a.fecha)) {
                const tipoBadge = m.tipo === 'entrada' ? 
                    '<span class="badge bg-success"><i class="bi bi-arrow-down-short"></i> Entrada</span>' : 
                    '<span class="badge bg-warning"><i class="bi bi-arrow-up-short"></i> Salida</span>';
                
                html += `<tr>
                    <td><small>${new Date(m.fecha).toLocaleString()}</small></td>
                    <td><strong>${m.producto}</strong></td>
                    <td>${tipoBadge}</td>
                    <td><span class="badge bg-info">${m.cantidad}</span></td>
                    <td>${m.usuario}</td>
                </tr>`;
            }
            html += `</tbody></table></div>`;
        }
        
        app.innerHTML = html;
        bindEvents();
    }

    function bindEvents() {
        const btnAddMov = document.getElementById('btnAddMov');
        if (btnAddMov) btnAddMov.onclick = showForm;
    }

    function showForm() {
        const productos = Storage.getProductos();
        
        if (productos.length === 0) {
            alert('No hay productos. Por favor crea uno primero.');
            return;
        }
        
        app.innerHTML = `<div class="card">
            <div class="card-header">
                <h4 class="mb-0"><i class="bi bi-plus-circle"></i> Registrar Movimiento</h4>
            </div>
            <div class="card-body">
                <form id="movForm">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label"><i class="bi bi-box"></i> Producto</label>
                                <select class="form-select" id="producto" required>
                                    <option value="">Selecciona un producto</option>
                                    ${productos.map(p=>`<option value="${p.id}">${p.nombre} (Stock: ${p.stock})</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label"><i class="bi bi-arrow-left-right"></i> Tipo</label>
                                <select class="form-select" id="tipo" required>
                                    <option value="entrada">Entrada (Compra)</option>
                                    <option value="salida">Salida (Venta/Uso)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label"><i class="bi bi-hash"></i> Cantidad</label>
                        <input type="number" class="form-control" id="cantidad" min="1" placeholder="0" required>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-success">
                            <i class="bi bi-check-circle"></i> Registrar
                        </button>
                        <button type="button" class="btn btn-secondary" id="cancelar">
                            <i class="bi bi-x-circle"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>`;
        
        document.getElementById('movForm').onsubmit = function(e) {
            e.preventDefault();
            const productoId = document.getElementById('producto').value;
            const tipo = document.getElementById('tipo').value;
            const cantidad = parseInt(document.getElementById('cantidad').value);
            let productos = Storage.getProductos();
            const idx = productos.findIndex(p=>p.id==productoId);
            
            if (idx===-1) {
                alert('Producto no válido');
                return;
            }
            
            if (tipo==='entrada') {
                productos[idx].stock += cantidad;
            } else {
                if (productos[idx].stock < cantidad) {
                    alert('Stock insuficiente. Stock disponible: ' + productos[idx].stock);
                    return;
                }
                productos[idx].stock -= cantidad;
            }
            
            Storage.setProductos(productos);
            
            let movimientos = Storage.getMovimientos();
            movimientos.push({
                fecha: Date.now(),
                producto: productos[idx].nombre,
                tipo,
                cantidad,
                usuario: user.usuario
            });
            Storage.setMovimientos(movimientos);
            
            alert('✓ Movimiento registrado correctamente');
            render();
        };
        
        document.getElementById('cancelar').onclick = function(e) { 
            e.preventDefault(); 
            render(); 
        };
    }

    render();
});
