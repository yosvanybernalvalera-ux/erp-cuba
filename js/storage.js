// ============================================
// SISTEMA DE ALMACENAMIENTO LOCAL (JSON)
// ERP Cuba - 100% Offline
// ============================================

const STORAGE = {
    // Guardar datos en localStorage
    guardar: function(clave, datos) {
        localStorage.setItem('erp_' + clave, JSON.stringify(datos));
        return true;
    },
    
    // Leer datos de localStorage
    leer: function(clave) {
        var datos = localStorage.getItem('erp_' + clave);
        return datos ? JSON.parse(datos) : [];
    },
    
    // Agregar un registro nuevo
    agregar: function(clave, objeto) {
        var lista = this.leer(clave);
        objeto.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        objeto.fecha_creacion = new Date().toISOString();
        lista.push(objeto);
        this.guardar(clave, lista);
        return objeto;
    },
    
    // Actualizar un registro
    actualizar: function(clave, id, nuevosDatos) {
        var lista = this.leer(clave);
        for (var i = 0; i < lista.length; i++) {
            if (lista[i].id === id) {
                nuevosDatos.actualizado = new Date().toISOString();
                Object.assign(lista[i], nuevosDatos);
                this.guardar(clave, lista);
                return lista[i];
            }
        }
        return null;
    },
    
    // Eliminar un registro
    eliminar: function(clave, id) {
        var lista = this.leer(clave);
        var nuevaLista = lista.filter(function(item) { return item.id !== id; });
        this.guardar(clave, nuevaLista);
        return true;
    },
    
    // Buscar por campo
    buscar: function(clave, campo, valor) {
        var lista = this.leer(clave);
        return lista.filter(function(item) { return item[campo] === valor; });
    },
    
    // Obtener todos
    todos: function(clave) {
        return this.leer(clave);
    },
    
    // Inicializar datos de ejemplo
    inicializar: function() {
        // Solo inicializar si no hay datos
        if (!localStorage.getItem('erp_usuarios')) {
            this.guardar('usuarios', [
                {
                    id: 'admin001',
                    email: 'admin@proyectobernal.com',
                    password: '123456',
                    nombre: 'Administrador',
                    telefono: '+5351234567',
                    proyecto: 'Proyecto Bernal',
                    rol: 'Administrador',
                    activo: true
                }
            ]);
        }
        
        if (!localStorage.getItem('erp_clientes')) {
            this.guardar('clientes', [
                {
                    id: 'cli001',
                    nombre: 'Constructora La Habana',
                    proyecto: 'Proyecto Bernal',
                    carnet_identidad: '80010112345',
                    telefono: '+5371234567',
                    email: 'info@constructora.cu',
                    provincia: 'La Habana',
                    municipio: 'Plaza',
                    activo: true
                }
            ]);
        }
        
        if (!localStorage.getItem('erp_trabajadores')) {
            this.guardar('trabajadores', [
                {
                    id: 'tra001',
                    nombre: 'Carlos',
                    apellidos: 'Martínez',
                    proyecto: 'Proyecto Bernal',
                    especialidad: 'Albañilería',
                    tarifa_hora_cup: 350,
                    telefono: '+5352223344',
                    activo: true
                }
            ]);
        }
        
        if (!localStorage.getItem('erp_proyectos')) {
            this.guardar('proyectos', [
                {
                    id: 'pro001',
                    nombre: 'Remodelación Apartamento',
                    proyecto: 'Proyecto Bernal',
                    cliente_id: 'cli001',
                    estado: 'En Progreso',
                    prioridad: 'Alta',
                    presupuesto_cup: 450000,
                    moneda: 'CUP',
                    fecha_inicio: '2024-01-15',
                    fecha_fin: '2024-03-30'
                }
            ]);
        }
    },
    
    // Exportar todos los datos a un archivo JSON
    exportar: function() {
        var todosLosDatos = {
            usuarios: this.leer('usuarios'),
            clientes: this.leer('clientes'),
            trabajadores: this.leer('trabajadores'),
            proyectos: this.leer('proyectos'),
            exportado: new Date().toISOString()
        };
        
        var blob = new Blob([JSON.stringify(todosLosDatos, null, 2)], {type: 'application/json'});
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'erp_cuba_backup_' + new Date().toISOString().slice(0,10) + '.json';
        a.click();
        return true;
    },
    
    // Importar datos desde archivo JSON
    importar: function(archivo, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var datos = JSON.parse(e.target.result);
                if (datos.usuarios) STORAGE.guardar('usuarios', datos.usuarios);
                if (datos.clientes) STORAGE.guardar('clientes', datos.clientes);
                if (datos.trabajadores) STORAGE.guardar('trabajadores', datos.trabajadores);
                if (datos.proyectos) STORAGE.guardar('proyectos', datos.proyectos);
                callback(true, 'Datos importados correctamente');
            } catch(error) {
                callback(false, 'Error al importar: ' + error.message);
            }
        };
        reader.readAsText(archivo);
    }
};

// Inicializar datos de ejemplo al cargar
STORAGE.inicializar();

console.log('✅ Sistema de almacenamiento local listo');