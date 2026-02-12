// --- Módulo de Persistencia en localStorage ---
const Storage = {
    getProductos: () => JSON.parse(localStorage.getItem('productos') || '[]'),
    setProductos: (productos) => localStorage.setItem('productos', JSON.stringify(productos)),
    getCategorias: () => JSON.parse(localStorage.getItem('categorias') || '[]'),
    setCategorias: (categorias) => localStorage.setItem('categorias', JSON.stringify(categorias)),
    getMovimientos: () => JSON.parse(localStorage.getItem('movimientos') || '[]'),
    setMovimientos: (movimientos) => localStorage.setItem('movimientos', JSON.stringify(movimientos)),
    getUsuarios: () => JSON.parse(localStorage.getItem('usuarios') || '[]'),
    setUsuarios: (usuarios) => localStorage.setItem('usuarios', JSON.stringify(usuarios)),
};
