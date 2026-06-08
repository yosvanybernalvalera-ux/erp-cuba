var STORAGE = {
    guardar: function(clave, datos) {
        localStorage.setItem('erp_' + clave, JSON.stringify(datos));
        return true;
    },
    leer: function(clave) {
        var datos = localStorage.getItem('erp_' + clave);
        return datos ? JSON.parse(datos) : [];
    },
    agregar: function(clave, objeto) {
        var lista = this.leer(clave);
        objeto.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        objeto.fecha_creacion = new Date().toISOString();
        lista.push(objeto);
        this.guardar(clave, lista);
        return objeto;
    },
    actualizar: function(clave, id, nuevosDatos) {
        var lista = this.leer(clave);
        for (var i = 0; i < lista.length; i++) {
            if (lista[i].id === id) {
                for (var key in nuevosDatos) {
                    lista[i][key] = nuevosDatos[key];
                }
                lista[i].actualizado = new Date().toISOString();
                this.guardar(clave, lista);
                return lista[i];
            }
        }
        return null;
    },
    eliminar: function(clave, id) {
        var lista = this.leer(clave);
        var nuevaLista = lista.filter(function(item) { return item.id !== id; });
        this.guardar(clave, nuevaLista);
        return true;
    },
    buscar: function(clave, campo, valor) {
        var lista = this.leer(clave);
        if (!valor) return lista;
        return lista.filter(function(item) { return item[campo] === valor; });
    },
    todos: function(clave) {
        return this.leer(clave);
    },
    buscarPorId: function(clave, id) {
        var lista = this.leer(clave);
        return lista.find(function(item) { return item.id === id; });
    },
    inicializar: function() {
        // Crear usuario admin si no existe
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
                    es_trabajador: false,
                    activo: true
                },
                {
                    id: 'user001',
                    email: 'carlos@proyectobernal.com',
                    password: '123456',
                    nombre: 'Carlos',
                    telefono: '+5352223344',
                    proyecto: 'Proyecto Bernal',
                    rol: 'Usuario',
                    es_trabajador: true,
                    activo: true
                },
                {
                    id: 'user002',
                    email: 'ana@proyectobernal.com',
                    password: '123456',
                    nombre: 'Ana',
                    telefono: '+5353334455',
                    proyecto: 'Proyecto Bernal',
                    rol: 'Usuario',
                    es_trabajador: true,
                    activo: true
                }
            ]);
        }
        
        if (!localStorage.getItem('erp_clientes')) {
            this.guardar('clientes', [
                { id: 'cli001', nombre: 'Constructora La Habana', proyecto: 'Proyecto Bernal', telefono: '+5371234567', provincia: 'La Habana', municipio: 'Plaza', activo: true },
                { id: 'cli002', nombre: 'Paladar Doña Rosa', proyecto: 'Proyecto Bernal', telefono: '+5351239876', provincia: 'La Habana', municipio: 'Centro Habana', activo: true }
            ]);
        }
        
        // Trabajadores se crean a partir de usuarios con es_trabajador = true
        if (!localStorage.getItem('erp_trabajadores')) {
            this.guardar('trabajadores', [
                { id: 'tra001', usuario_id: 'user001', nombre: 'Carlos', apellidos: 'Martínez', proyecto: 'Proyecto Bernal', especialidad: 'Albañilería', tarifa_hora_cup: 350, telefono: '+5352223344', activo: true },
                { id: 'tra002', usuario_id: 'user002', nombre: 'Ana', apellidos: 'Sánchez', proyecto: 'Proyecto Bernal', especialidad: 'Electricidad', tarifa_hora_cup: 400, telefono: '+5353334455', activo: true }
            ]);
        }
        
        if (!localStorage.getItem('erp_proyectos')) {
            this.guardar('proyectos', [
                { id: 'pro001', nombre: 'Remodelación Apartamento', proyecto: 'Proyecto Bernal', cliente_id: 'cli001', estado: 'En Progreso', prioridad: 'Alta', presupuesto_cup: 450000, moneda: 'CUP', fecha_inicio: '2024-01-15', fecha_fin: '2024-03-30', trabajadores_asignados: ['tra001'] },
                { id: 'pro002', nombre: 'Reforma Baño', proyecto: 'Proyecto Bernal', cliente_id: 'cli002', estado: 'Pendiente', prioridad: 'Media', presupuesto_cup: 85000, moneda: 'CUP', fecha_inicio: '2024-02-01', fecha_fin: '2024-02-28', trabajadores_asignados: [] }
            ]);
        }
    },
    // Obtener usuarios que pueden ser trabajadores
    usuariosTrabajadores: function(proyecto) {
        var usuarios = this.leer('usuarios');
        return usuarios.filter(function(u) {
            return u.proyecto === proyecto && u.activo !== false;
        });
    },
    // Convertir usuario en trabajador
    convertirEnTrabajador: function(usuarioId, especialidad, tarifa_cup) {
        var usuario = this.buscarPorId('usuarios', usuarioId);
        if (!usuario) return null;
        
        // Marcar como trabajador
        this.actualizar('usuarios', usuarioId, { es_trabajador: true });
        
        // Crear registro de trabajador
        var trabajador = {
            usuario_id: usuarioId,
            nombre: usuario.nombre.split(' ')[0] || usuario.nombre,
            apellidos: usuario.nombre.split(' ').slice(1).join(' ') || '',
            proyecto: usuario.proyecto,
            especialidad: especialidad || 'General',
            tarifa_hora_cup: tarifa_cup || 0,
            telefono: usuario.telefono,
            activo: true
        };
        
        return this.agregar('trabajadores', trabajador);
    },
    exportar: function() {
        var datos = {
            usuarios: this.leer('usuarios'),
            clientes: this.leer('clientes'),
            trabajadores: this.leer('trabajadores'),
            proyectos: this.leer('proyectos'),
            exportado: new Date().toISOString()
        };
        var blob = new Blob([JSON.stringify(datos, null, 2)], {type: 'application/json'});
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'erp_backup_' + new Date().toISOString().slice(0,10) + '.json';
        a.click();
    }
};

STORAGE.inicializar();
console.log('✅ Storage listo - Usuarios admin:', STORAGE.leer('usuarios').length);
console.log('✅ Storage listo - Trabajadores:', STORAGE.leer('trabajadores').length);