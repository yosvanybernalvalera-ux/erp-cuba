// ============================================
// ERP CUBA - Funciones Compartidas
// ============================================

// Configuración de Supabase
const SUPABASE_URL = 'https://TU_PROJECT_URL.supabase.co';
const SUPABASE_KEY = 'TU_ANON_KEY';

// Variable global para el cliente de Supabase
let supabase = null;

// Usuario actual
let currentUser = null;

// Inicializar Supabase
function initSupabase() {
    if (!supabase) {
        // Usar CDN más rápido para Cuba
        if (typeof window.supabase !== 'undefined') {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        } else {
            console.error('Supabase no está cargado');
        }
    }
    return supabase;
}

// Verificar sesión activa
function verificarSesion() {
    const session = localStorage.getItem('erp_session') || sessionStorage.getItem('erp_session');
    
    if (!session) {
        window.location.href = 'index.html';
        return null;
    }
    
    try {
        currentUser = JSON.parse(session);
        return currentUser;
    } catch (e) {
        localStorage.removeItem('erp_session');
        sessionStorage.removeItem('erp_session');
        window.location.href = 'index.html';
        return null;
    }
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('erp_session');
    sessionStorage.removeItem('erp_session');
    window.location.href = 'index.html';
}

// Formatear moneda CUP
function formatoCUP(valor) {
    return (valor || 0).toLocaleString('es-ES', { 
        style: 'decimal', 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
    }) + ' CUP';
}

// Formatear fecha
function formatoFecha(fecha) {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Validar teléfono cubano
function validarTelefonoCubano(telefono) {
    const regex = /^\+53[5-7][0-9]{7}$/;
    return regex.test(telefono);
}

// Mostrar mensaje temporal
function mostrarMensaje(elemento, texto, tipo = 'info') {
    const mensaje = document.getElementById(elemento);
    if (!mensaje) return;
    
    mensaje.textContent = texto;
    mensaje.className = 'mensaje ' + tipo;
    
    setTimeout(() => {
        mensaje.textContent = '';
        mensaje.className = 'mensaje';
    }, 5000);
}

// Toggle sidebar en móvil
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (sidebar && mainContent) {
        sidebar.classList.toggle('closed');
        mainContent.classList.toggle('expanded');
    }
}

// Cargar provincias de Cuba
const provinciasCuba = [
    'Pinar del Río', 'Artemisa', 'La Habana', 'Mayabeque', 'Matanzas',
    'Cienfuegos', 'Villa Clara', 'Sancti Spíritus', 'Ciego de Ávila',
    'Camagüey', 'Las Tunas', 'Holguín', 'Granma', 'Santiago de Cuba',
    'Guantánamo', 'Isla de la Juventud'
];

// Cargar municipios por provincia (ejemplo para La Habana)
const municipiosPorProvincia = {
    'La Habana': ['Plaza', 'Centro Habana', 'Habana Vieja', 'Diez de Octubre', 
                  'Cerro', 'Marianao', 'Playa', 'Boyeros', 'Arroyo Naranjo'],
    'Pinar del Río': ['Pinar del Río', 'Viñales', 'Consolación del Sur'],
    'Santiago de Cuba': ['Santiago de Cuba', 'Palma Soriano', 'Contramaestre']
};

console.log('✅ ERP Cuba - Módulo compartido cargado');
