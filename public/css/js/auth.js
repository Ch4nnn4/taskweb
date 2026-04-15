const API = 'http://localhost:3000/api';

// Obtener token
function getToken() {
  return localStorage.getItem('token');
}

// Obtener tareas
async function getTasks() {
  try {
    const res = await fetch(`${API}/tasks`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data.message);
      return;
    }

    renderTasks(data);
  } catch (err) {
    console.error('Error al obtener tareas');
  }
}

// Crear tarea
async function createTask() {
  const titulo = document.getElementById('titulo').value;
  const descripcion = document.getElementById('descripcion').value;
  const prioridad = document.getElementById('prioridad').value;
  const fecha_limite = document.getElementById('fecha_limite').value;

  if (!titulo) {
    alert('El título es obligatorio');
    return;
  }

  try {
    const res = await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        titulo,
        descripcion,
        prioridad,
        fecha_limite
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    getTasks();
    limpiarFormulario();
  } catch (err) {
    console.error('Error al crear tarea');
  }
}

// Actualizar tarea
async function updateTask(id, tareaActual) {
  try {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        completada: tareaActual.completada ? 0 : 1
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data.message);
      return;
    }

    getTasks();
  } catch (err) {
    console.error('Error al actualizar tarea');
  }
}

// Eliminar tarea
async function deleteTask(id) {
  if (!confirm('¿Eliminar tarea?')) return;

  try {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    getTasks();
  } catch (err) {
    console.error('Error al eliminar tarea');
  }
}

// Renderizar tareas
function renderTasks(tasks) {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');

    li.innerHTML = `
      <strong>${task.titulo}</strong> - ${task.descripcion || ''}
      <br>
      Prioridad: ${task.prioridad} | Fecha: ${task.fecha_limite || 'Sin fecha'}
      <br>
      Estado: ${task.completada ? '✅ Completada' : '⏳ Pendiente'}
      <br>
      <button onclick='updateTask(${task.id}, ${JSON.stringify(task)})'>Cambiar estado</button>
      <button onclick='deleteTask(${task.id})'>Eliminar</button>
      <hr>
    `;

    list.appendChild(li);
  });
}

// Limpiar formulario
function limpiarFormulario() {
  document.getElementById('titulo').value = '';
  document.getElementById('descripcion').value = '';
  document.getElementById('prioridad').value = 'media';
  document.getElementById('fecha_limite').value = '';
}

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', getTasks);