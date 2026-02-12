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
        if (user.role === 'admin') {
            html += `<div class="d-flex justify-content-between align-items-center mb-3">
                <h2>Productos</h2>
                <button class="btn btn-success" id="btnAdd">Agregar Producto</button>
            </div>`;
        } else {
            html += `<h2>Inventario Disponible</h2>`;
        }
        html += `<table class="table table-striped"><thead><tr><th>Nombre</th><th>Categoría</th><th>Stock</th><th>Precio</th>${user.role==='admin'?'<th>Acciones</th>':''}</tr></thead><tbody>`;
        for (const p of productos) {
            html += `<tr>
                <td>${p.nombre}</td>
                <td>${p.categoria}</td>
                <td>${p.stock}</td>
                <td>$${p.precio.toFixed(2)}</td>`;
            if (user.role === 'admin') {
                html += `<td>
                    <button class="btn btn-sm btn-primary me-1" data-edit="${p.id}">Editar</button>
                    <button class="btn btn-sm btn-danger" data-del="${p.id}">Eliminar</button>
                </td>`;
            }
            html += `</tr>`;
        }
        html += `</tbody></table>`;
        if (user.role === 'admin') {
            html += `<h4 class="mt-4">Categorías</h4>
            <ul class="list-group mb-3">${categorias.map(c=>`<li class="list-group-item d-flex justify-content-between align-items-center">${c}<button class="btn btn-sm btn-danger" data-delcat="${c}">Eliminar</button></li>`).join('')}</ul>
            <form id="catForm" class="d-flex mb-3"><input class="form-control me-2" id="catInput" placeholder="Nueva categoría" required><button class="btn btn-secondary">Agregar</button></form>`;
        }
        app.innerHTML = html;
        bindEvents();
    }

    // --- Eventos ---
    function bindEvents() {
        if (user.role === 'admin') {
            const btnAdd = document.getElementById('btnAdd');
            if (btnAdd) btnAdd.onclick = showForm;
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
        const productos = Storage.getProductos();
        const categorias = Storage.getCategorias();
        let prod = id ? productos.find(p=>p.id==id) : {nombre:'',categoria:'',stock:0,precio:0};
        app.innerHTML = `<h3>${id?'Editar':'Agregar'} Producto</h3>
        <form id="prodForm">
            <div class="mb-2"><label>Nombre</label><input class="form-control" id="nombre" value="${prod.nombre||''}" required></div>
            <div class="mb-2"><label>Categoría</label><select class="form-select" id="categoria" required>${categorias.map(c=>`<option${prod.categoria===c?' selected':''}>${c}</option>`).join('')}</select></div>
            <div class="mb-2"><label>Stock</label><input type="number" class="form-control" id="stock" value="${prod.stock||0}" min="0" required></div>
            <div class="mb-2"><label>Precio</label><input type="number" class="form-control" id="precio" value="${prod.precio||0}" min="0" step="0.01" required></div>
            <button class="btn btn-primary mt-2">Guardar</button>
            <button class="btn btn-secondary mt-2 ms-2" id="cancelar">Cancelar</button>
        </form>`;
        document.getElementById('prodForm').onsubmit = function(e) {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value.trim();
            const categoria = document.getElementById('categoria').value;
            const stock = parseInt(document.getElementById('stock').value);
            const precio = parseFloat(document.getElementById('precio').value);
            if (id) {
                // Editar
                const idx = productos.findIndex(p=>p.id==id);
                productos[idx] = {...productos[idx], nombre, categoria, stock, precio};
            } else {
                // Crear
                productos.push({id:Date.now(), nombre, categoria, stock, precio});
            }
            Storage.setProductos(productos);
            render();
        };
        document.getElementById('cancelar').onclick = function(e) { e.preventDefault(); render(); };
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
