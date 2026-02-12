// --- CRUD de Productos y Categorías ---
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) { window.location.href = 'index.html'; return; }
    const app = document.getElementById('productosApp');
    if (!app) return;

    // --- UI ---
    function render() {
        const productos = Storage.getProductos();
        const categorias = Storage.getCategorias();
        let html = '';
        
        html += `<div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="mb-0"><i class="bi bi-box-fill"></i> ${user.role === 'admin' ? 'Gestión de Productos' : 'Productos Disponibles'}</h3>
            <button class="btn btn-success" id="btnAdd">
                <i class="bi bi-plus-circle-fill"></i> Agregar Producto
            </button>
        </div>`;

        if (productos.length === 0) {
            html += `<div class="alert alert-info text-center">
                <i class="bi bi-info-circle"></i> No hay productos registrados
            </div>`;
        } else {
            // Agrupar productos por categoría
            const productosPorCategoria = {};
            for (const p of productos) {
                if (!productosPorCategoria[p.categoria]) {
                    productosPorCategoria[p.categoria] = [];
                }
                productosPorCategoria[p.categoria].push(p);
            }

            // Mostrar por categoría con acordeón
            html += `<div class="accordion mb-4" id="productosAccordion">`;
            
            for (const [categoria, prods] of Object.entries(productosPorCategoria)) {
                const id = categoria.replace(/\s+/g, '-');
                html += `<div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${id}">
                            <i class="bi bi-folder-fill me-2"></i> <strong>${categoria}</strong>
                            <span class="badge bg-primary ms-2">${prods.length} productos</span>
                        </button>
                    </h2>
                    <div id="${id}" class="accordion-collapse collapse" data-bs-parent="#productosAccordion">
                        <div class="accordion-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th><i class="bi bi-tag"></i> Nombre</th>
                                            <th><i class="bi bi-box"></i> Stock</th>
                                            <th><i class="bi bi-currency-dollar"></i> Precio</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;
                
                for (const p of prods) {
                    const stockBadge = p.stock <= 5 ? 'bg-danger' : p.stock <= 10 ? 'bg-warning' : 'bg-success';
                    html += `<tr>
                        <td><strong>${p.nombre}</strong></td>
                        <td><span class="badge ${stockBadge}">${p.stock} unidades</span></td>
                        <td><strong>$${p.precio.toFixed(2)}</strong></td>
                        <td>`;
                    
                    if (user.role === 'admin') {
                        html += `<button class="btn btn-sm btn-primary me-1" data-edit="${p.id}" title="Editar">
                            <i class="bi bi-pencil-square"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger" data-del="${p.id}" title="Eliminar">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>`;
                    } else {
                        html += `<button class="btn btn-sm btn-info" title="Ver detalles">
                            <i class="bi bi-eye"></i> Ver
                        </button>`;
                    }
                    html += `</td></tr>`;
                }
                
                html += `</tbody></table></div></div></div></div>`;
            }
            
            html += `</div>`;
        }

        if (user.role === 'admin') {
            html += `<div class="card mt-4"><div class="card-header">
                <h5 class="mb-0"><i class="bi bi-folder2"></i> Gestión de Categorías</h5>
            </div><div class="card-body">`;
            
            if (categorias.length > 0) {
                html += `<div class="row mb-3">`;
                for (const c of categorias) {
                    html += `<div class="col-md-4 mb-2">
                        <div class="card card-sm hover-shadow">
                            <div class="card-body d-flex justify-content-between align-items-center p-3">
                                <span><i class="bi bi-folder-fill"></i> ${c}</span>
                                <button class="btn btn-sm btn-danger" data-delcat="${c}">
                                    <i class="bi bi-x"></i>
                                </button>
                            </div>
                        </div>
                    </div>`;
                }
                html += `</div>`;
            } else {
                html += `<p class="text-muted"><i class="bi bi-info-circle"></i> No hay categorías</p>`;
            }

            html += `<form id="catForm" class="mt-3">
                <div class="input-group">
                    <input class="form-control" id="catInput" placeholder="Nueva categoría" required>
                    <button class="btn btn-primary" type="submit">
                        <i class="bi bi-plus-lg"></i> Agregar
                    </button>
                </div>
            </form></div></div>`;
        }

        app.innerHTML = html;
        bindEvents();
    }

    // --- Eventos ---
    function bindEvents() {
        const btnAdd = document.getElementById('btnAdd');
        if (btnAdd) btnAdd.onclick = showForm;
        
        if (user.role === 'admin') {
            document.querySelectorAll('[data-edit]').forEach(btn => {
                btn.onclick = () => showForm(btn.getAttribute('data-edit'));
            });
            document.querySelectorAll('[data-del]').forEach(btn => {
                btn.onclick = () => deleteProducto(btn.getAttribute('data-del'));
            });
            document.querySelectorAll('[data-delcat]').forEach(btn => {
                btn.onclick = () => deleteCategoria(btn.getAttribute('data-delcat'));
            });
            const catForm = document.getElementById('catForm');
            if (catForm) catForm.onsubmit = addCategoria;
        }
    }

    // --- CRUD Producto ---
    function showForm(id) {
        // Solo admin puede editar, empleados solo pueden agregar
        if (id && user.role !== 'admin') {
            alert('Solo administradores pueden editar productos');
            return;
        }

        const productos = Storage.getProductos();
        let categorias = Storage.getCategorias();
        let prod = id ? productos.find(p=>p.id==id) : {nombre:'',categoria:'',stock:0,precio:0};
        
        let categoryOptions = '';
        if (categorias.length === 0) {
            categoryOptions = '<option value="">-- No hay categorías. Crea una primero --</option>';
        } else {
            categoryOptions = categorias.map(c=>`<option value="${c}"${prod.categoria===c?' selected':''}>${c}</option>`).join('');
        }
        
        app.innerHTML = `<div class="card">
            <div class="card-header">
                <h4 class="mb-0"><i class="bi bi-${id?'pencil-square':'plus-circle'}"></i> ${id?'Editar':'Agregar'} Producto</h4>
                <small class="text-muted d-block mt-2">${user.role === 'admin' ? 'Administrador' : 'Empleado'} - Puedes ${id ? 'modificar' : 'crear nuevos'} productos</small>
            </div>
            <div class="card-body">
                <form id="prodForm">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label"><i class="bi bi-tag"></i> Nombre del Producto</label>
                                <input class="form-control" id="nombre" value="${prod.nombre||''}" placeholder="Ej: iPhone 15 Pro" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label"><i class="bi bi-folder"></i> Categoría</label>
                                <select class="form-select" id="categoria" required>${categoryOptions}</select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label"><i class="bi bi-box"></i> Stock</label>
                                <input type="number" class="form-control" id="stock" value="${prod.stock||0}" min="0" placeholder="0" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label"><i class="bi bi-currency-dollar"></i> Precio Unitario</label>
                                <div class="input-group">
                                    <span class="input-group-text">$</span>
                                    <input type="number" class="form-control" id="precio" value="${prod.precio||0}" min="0" step="0.01" placeholder="0.00" required>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-circle"></i> ${id ? 'Actualizar' : 'Crear'} Producto
                        </button>
                        <button type="button" class="btn btn-secondary" id="cancelar">
                            <i class="bi bi-x-circle"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>`;
        
        document.getElementById('prodForm').onsubmit = function(e) {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value.trim();
            const categoria = document.getElementById('categoria').value;
            const stock = parseInt(document.getElementById('stock').value);
            const precio = parseFloat(document.getElementById('precio').value);
            
            if (!nombre) {
                alert('El nombre del producto es requerido');
                return;
            }
            
            if (!categoria) {
                alert('Debes seleccionar una categoría');
                return;
            }
            
            if (id) {
                const idx = productos.findIndex(p=>p.id==id);
                productos[idx] = {...productos[idx], nombre, categoria, stock, precio};
            } else {
                productos.push({id:Date.now(), nombre, categoria, stock, precio});
            }
            Storage.setProductos(productos);
            alert(`✓ Producto ${id ? 'actualizado' : 'creado'} correctamente`);
            render();
        };
        
        document.getElementById('cancelar').onclick = function(e) { 
            e.preventDefault(); 
            render(); 
        };
    }
    function deleteProducto(id) {
        if (!confirm('¿Eliminar producto?')) return;
        let productos = Storage.getProductos();
        productos = productos.filter(p=>p.id!=id);
        Storage.setProductos(productos);
        render();
    }

    // --- CRUD Categoría ---
    function addCategoria(e) {
        e.preventDefault();
        const val = document.getElementById('catInput').value.trim();
        if (!val) return;
        let categorias = Storage.getCategorias();
        if (!categorias.includes(val)) {
            categorias.push(val);
            Storage.setCategorias(categorias);
        }
        render();
    }
    function deleteCategoria(cat) {
        if (!confirm('¿Eliminar categoría?')) return;
        let categorias = Storage.getCategorias();
        categorias = categorias.filter(c=>c!==cat);
        Storage.setCategorias(categorias);
        // Quitar categoría de productos
        let productos = Storage.getProductos();
        productos = productos.map(p=>p.categoria===cat?{...p,categoria:''}:p);
        Storage.setProductos(productos);
        render();
    }

    render();
});
