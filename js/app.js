
    // --- USUARIO Y CRUD LOCAL ---
    let usuarioAutenticado = false;
    let tipoActual = "todos";
    let items = [
      {id:1, nombre:"Toyota Corolla", tipo:"auto", precio:"$50,000", imagen:"https://images.unsplash.com/photo-1511918984145-48de785d4c4e?fit=crop&w=400&q=80"},
      {id:2, nombre:"Honda Civic", tipo:"auto", precio:"$42,500", imagen:"https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?fit=crop&w=400&q=80"},
      {id:3, nombre:"Volkswagen Golf", tipo:"auto", precio:"$93,200", imagen:"https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?fit=crop&w=400&q=80"},
      {id:4, nombre:"BMW Serie 3", tipo:"auto", precio:"$72,950", imagen:"https://images.unsplash.com/photo-1511918984145-48de785d4c4e?fit=crop&w=400&q=80"},
      {id:5, nombre:"Kawasaki Ninja", tipo:"moto", precio:"$50,000", imagen:"https://images.unsplash.com/photo-1519864600264-2b6f1babe3a8?fit=crop&w=400&q=80"},
      {id:6, nombre:"Harley Davidson", tipo:"moto", precio:"$100,500", imagen:"https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?fit=crop&w=400&q=80"},
      {id:7, nombre:"Yamaha FZ", tipo:"moto", precio:"$93,200", imagen:"https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?fit=crop&w=400&q=80"},
      {id:8, nombre:"Suzuki GN", tipo:"moto", precio:"$72,950", imagen:"https://images.unsplash.com/photo-1519864600264-2b6f1babe3a8?fit=crop&w=400&q=80"}
    ];
    let nextId = items.length + 1;
    let editId = null;

    // --- FUNCIONES DE INTERFAZ ---

    function mostrarLanding() {
      document.getElementById('mainContent').classList.remove('hidden');
      document.getElementById('loginPage').classList.add('hidden');
      document.getElementById('crudPage').classList.add('hidden');
      document.getElementById('loginMenuBtn').classList.remove('hidden');
      document.getElementById('logoutMenuBtn').classList.add('hidden');
      cargarItems();
    }
    function mostrarLogin() {
      document.getElementById('mainContent').classList.add('hidden');
      document.getElementById('crudPage').classList.add('hidden');
      document.getElementById('loginPage').classList.remove('hidden');
      document.getElementById('loginMenuBtn').classList.add('hidden');
      document.getElementById('logoutMenuBtn').classList.add('hidden');
    }
    function mostrarCrud() {
      document.getElementById('mainContent').classList.add('hidden');
      document.getElementById('loginPage').classList.add('hidden');
      document.getElementById('crudPage').classList.remove('hidden');
      document.getElementById('loginMenuBtn').classList.add('hidden');
      document.getElementById('logoutMenuBtn').classList.remove('hidden');
      cargarItems();
    }
    // --- EVENTOS MENU ---
    document.getElementById('loginMenuBtn').onclick = mostrarLogin;
    document.getElementById('logoutMenuBtn').onclick = () => {
      usuarioAutenticado = false;
      mostrarLanding();
    };
    function setTipo(tipo) {
      tipoActual = tipo;
      document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
      if (tipo === "todos") document.getElementById('todosBtn').classList.add('active');
      if (tipo === "motos") document.getElementById('motosBtn').classList.add('active');
      if (tipo === "autos") document.getElementById('autosBtn').classList.add('active');
      cargarItems();
    }
    document.getElementById('todosBtn').onclick = () => setTipo('todos');
    document.getElementById('motosBtn').onclick = () => setTipo('motos');
    document.getElementById('autosBtn').onclick = () => setTipo('autos');

    // --- LOGIN (dummy, sin credenciales, cualquier usuario sirve) ---
    document.getElementById('loginForm').onsubmit = function(e){
      e.preventDefault();
      // Aquí iría la validación contra el backend.
      // Por ahora, cualquier usuario y clave permite el acceso.
      usuarioAutenticado = true;
      document.getElementById('loginError').innerText = "";
      mostrarCrud();
    };

    // --- CRUD ---
    function cargarItems(){
      if (!usuarioAutenticado){
        // Landing page: muestra solo items filtrados
        let html = "";
        const filtrados = tipoActual === "todos" ? items : items.filter(i=>i.tipo===tipoActual);
        filtrados.forEach(item => {
          html += `<div class="card">
            <img src="${item.imagen || 'https://via.placeholder.com/400x200'}" alt="${item.nombre}">
            <strong>${item.nombre}</strong>
            <span>Tipo: ${item.tipo}</span>
            <span>Precio: ${item.precio}</span>
          </div>`;
        });
        document.getElementById('mainContent').innerHTML = `<h2>Vehículos disponibles: ${tipoActual.charAt(0).toUpperCase()+tipoActual.slice(1)}</h2>${html}`;
      } else {
        // Panel CRUD
        let html = "";
        items.forEach(item => {
          html += `<div class="card">
            <img src="${item.imagen || 'https://via.placeholder.com/400x200'}" alt="${item.nombre}">
            <strong>${item.nombre}</strong>
            <span>Tipo: ${item.tipo}</span>
            <span>Precio: ${item.precio}</span>
            <button class="crud-btn" onclick="editarItem(${item.id})">Editar</button>
            <button class="crud-btn" style="background:#dc2626;" onclick="eliminarItem(${item.id})">Eliminar</button>
          </div>`;
        });
        document.getElementById('crudList').innerHTML = html;
      }
    }
    // --- AGREGAR/EDITAR ---
    document.getElementById('addItemBtn').onclick = () => {
      editId = null;
      document.getElementById('addForm').classList.remove('hidden');
      document.getElementById('itemNombre').value = "";
      document.getElementById('itemTipo').value = "";
      document.getElementById('itemPrecio').value = "";
      document.getElementById('itemImagen').value = "";
    };
    document.getElementById('cancelItemBtn').onclick = () => {
      document.getElementById('addForm').classList.add('hidden');
    };
    document.getElementById('saveItemBtn').onclick = () => {
      const nombre = document.getElementById('itemNombre').value;
      const tipo = document.getElementById('itemTipo').value;
      const precio = document.getElementById('itemPrecio').value;
      const imagen = document.getElementById('itemImagen').value;
      if (!nombre || !tipo || !precio) return alert("Completa todos los campos");
      if (editId){
        const idx = items.findIndex(i=>i.id===editId);
        if (idx>-1){
          items[idx] = {id:editId, nombre, tipo, precio, imagen};
        }
      } else {
        items.push({id:nextId++, nombre, tipo, precio, imagen});
      }
      cargarItems();
      document.getElementById('addForm').classList.add('hidden');
    };
    window.editarItem = function(id){
      const item = items.find(i=>i.id===id);
      if (!item) return;
      editId = id;
      document.getElementById('addForm').classList.remove('hidden');
      document.getElementById('itemNombre').value = item.nombre;
      document.getElementById('itemTipo').value = item.tipo;
      document.getElementById('itemPrecio').value = item.precio;
      document.getElementById('itemImagen').value = item.imagen || "";
    }
    window.eliminarItem = function(id){
      if (!confirm("¿Seguro que deseas eliminar este vehículo?")) return;
      items = items.filter(i=>i.id!==id);
      cargarItems();
    }

    // --- INICIALIZA ---
    mostrarLanding();
