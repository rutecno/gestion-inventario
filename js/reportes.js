// --- Panel de Estadísticas y Reportes ---
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') { window.location.href = 'index.html'; return; }
    const app = document.getElementById('reportesApp');
    if (!app) return;

    function render() {
        const productos = Storage.getProductos();
        const movimientos = Storage.getMovimientos();
        
        const bajoStock = productos.filter(p=>p.stock<=5);
        const movCount = {};
        for (const m of movimientos) {
            movCount[m.producto] = (movCount[m.producto]||0)+1;
        }
        const masMov = Object.entries(movCount).sort((a,b)=>b[1]-a[1]).slice(0,5);
        
        let html = `<div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="mb-0"><i class="bi bi-bar-chart-fill"></i> Panel de Estadísticas</h3>
            <button class="btn btn-primary" id="downloadPdf">
                <i class="bi bi-file-pdf-fill"></i> Descargar PDF
            </button>
        </div>`;
        
        html += `<div id="reportContent">`;
        
        // Estadísticas en Cards
        html += `<div class="row mb-4">
            <div class="col-md-6">
                <div class="card hover-shadow">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="bi bi-exclamation-triangle-fill"></i> Productos con Bajo Stock (≤5)</h5>
                    </div>
                    <div class="card-body">
                        ${bajoStock.length ? 
                            `<ul class="list-group list-group-flush">
                                ${bajoStock.map(p=>`<li class="list-group-item d-flex justify-content-between align-items-center">
                                    ${p.nombre}
                                    <span class="badge bg-danger">${p.stock} unid.</span>
                                </li>`).join('')}
                            </ul>` : 
                            '<p class="text-muted text-center mb-0"><i class="bi bi-check-circle"></i> Todo OK</p>'}
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="card hover-shadow">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="bi bi-graph-up-arrow"></i> Productos con Más Movimientos</h5>
                    </div>
                    <div class="card-body">
                        ${masMov.length ? 
                            `<ul class="list-group list-group-flush">
                                ${masMov.map(([nombre,cant])=>`<li class="list-group-item d-flex justify-content-between align-items-center">
                                    ${nombre}
                                    <span class="badge bg-info">${cant}</span>
                                </li>`).join('')}
                            </ul>` : 
                            '<p class="text-muted text-center mb-0"><i class="bi bi-inbox"></i> Sin datos</p>'}
                    </div>
                </div>
            </div>
        </div>`;
        
        // Historial de Movimientos
        html += `<div class="card">
            <div class="card-header">
                <h5 class="mb-0"><i class="bi bi-clock-history"></i> Historial Completo de Movimientos</h5>
            </div>
            <div class="card-body p-0">
                ${movimientos.length ? `
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th><i class="bi bi-calendar"></i> Fecha</th>
                                <th><i class="bi bi-box"></i> Producto</th>
                                <th><i class="bi bi-arrow-left-right"></i> Tipo</th>
                                <th><i class="bi bi-hash"></i> Cantidad</th>
                                <th><i class="bi bi-person"></i> Usuario</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${movimientos.sort((a,b)=>b.fecha-a.fecha).map(m=>`<tr>
                                <td><small>${new Date(m.fecha).toLocaleString()}</small></td>
                                <td>${m.producto}</td>
                                <td>${m.tipo==='entrada' ? 
                                    '<span class="badge bg-success"><i class="bi bi-arrow-down"></i> Entrada</span>' : 
                                    '<span class="badge bg-warning"><i class="bi bi-arrow-up"></i> Salida</span>'}</td>
                                <td><strong>${m.cantidad}</strong></td>
                                <td>${m.usuario}</td>
                            </tr>`).join('')}
                        </tbody>
                    </table>
                </div>` : 
                '<p class="text-muted text-center py-4"><i class="bi bi-inbox"></i> Sin movimientos registrados</p>'}
            </div>
        </div>`;
        
        html += `</div>`;
        
        app.innerHTML = html;
        bindEvents();
    }

    function bindEvents() {
        const downloadBtn = document.getElementById('downloadPdf');
        if (downloadBtn) {
            downloadBtn.onclick = descargarPDF;
        }
    }

    function descargarPDF() {
        const reportContent = document.getElementById('reportContent');
        const element = reportContent.cloneNode(true);
        
        const opt = {
            margin: 10,
            filename: 'reporte_inventario_' + new Date().toISOString().slice(0,10) + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: false },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };

        html2pdf().set(opt).from(element).save();
        alert('✓ Reporte descargado exitosamente');
    }

    render();
});

