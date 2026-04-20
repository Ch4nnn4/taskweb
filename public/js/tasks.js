const API = 'https://taskweb-re40.onrender.com/api';
const token = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('usuario'));

if (!token) window.location.href = 'index.html';

document.getElementById('nombreUsuario').textContent = usuario?.nombre || '';

let tareas = [];
let tabActual = 'pendientes';

async function loadTasks() {
  try {
    const res = await fetch(`${API}/tasks`, {
      headers: { authorization: token }
    });
    tareas = await res.json();
    renderTasks();
  } catch (err) {
    console.error('Error cargando tareas:', err);
  }
}

function renderTasks() {
  const pendientes = tareas.filter(t => !t.completada);
  const completadas = tareas.filter(t => t.completada);

  document.getElementById('listaPendientes').innerHTML =
    pendientes.length ? pendientes.map(taskCard).join('') : '<p style="color:#888;text-align:center;padding:20px">No tienes tareas pendientes</p>';

  document.getElementById('listaCompletadas').innerHTML =
    completadas.length ? completadas.map(taskCard).join('') : '<p style="color:#888;text-align:center;padding:20px">No has completado tareas aún</p>';
}

function taskCard(t) {
  const hoy = new Date().toISOString().split('T')[0];
  const vencida = t.fecha_limite && t.fecha_limite.split('T')[0] < hoy && !t.completada;
  const claseCard = t.completada ? 'completada' : vencida ? 'vencida' : '';

  return `
    <div class="task-card ${claseCard}">
      <div class="task-info">
        <h4>${t.titulo}</h4>
        ${t.descripcion ? `<p>${t.descripcion}</p>` : ''}
        <p>
          <span class="badge badge-${t.prioridad}">${t.prioridad}</span>
          ${t.fecha_limite ? ` · Entrega: ${t.fecha_limite.split('T')[0]}` : ''}
          ${vencida ? ' · <span style="color:#ef4444">Vencida</span>' : ''}
        </p>
      </div>
      <div class="task-actions">
        ${!t.completada
          ? `<button class="btn btn-success" onclick="toggleComplete(${t.id}, 1)">✓</button>`
          : `<button class="btn" style="background:#888;padding:6px 12px;font-size:12px;width:auto;border-radius:6px" onclick="toggleComplete(${t.id}, 0)">↩</button>`
        }
        <button class="btn" style="background:#f59e0b;padding:6px 12px;font-size:12px;width:auto;border-radius:6px" onclick="openEdit(${t.id})">✎</button>
        <button class="btn btn-danger" onclick="deleteTask(${t.id})">✕</button>
      </div>
    </div>
  `;
}

async function createTask() {
  const titulo = document.getElementById('titulo').value;
  const descripcion = document.getElementById('descripcion').value;
  const prioridad = document.getElementById('prioridad').value;
  const fecha_limite = document.getElementById('fecha_limite').value;

  if (!titulo) {
    alert('El título es obligatorio');
    return;
  }

  await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', authorization: token },
    body: JSON.stringify({ titulo, descripcion, prioridad, fecha_limite })
  });

  document.getElementById('titulo').value = '';
  document.getElementById('descripcion').value = '';
  document.getElementById('fecha_limite').value = '';
  loadTasks();
}

async function toggleComplete(id, completada) {
  const tarea = tareas.find(t => t.id === id);
  await fetch(`${API}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', authorization: token },
    body: JSON.stringify({ ...tarea, completada })
  });
  loadTasks();
}

async function deleteTask(id) {
  if (!confirm('¿Eliminar esta tarea?')) return;
  await fetch(`${API}/tasks/${id}`, {
    method: 'DELETE',
    headers: { authorization: token }
  });
  loadTasks();
}

function openEdit(id) {
  const tarea = tareas.find(t => t.id === id);
  document.getElementById('titulo').value = tarea.titulo;
  document.getElementById('descripcion').value = tarea.descripcion || '';
  document.getElementById('prioridad').value = tarea.prioridad;
  document.getElementById('fecha_limite').value = tarea.fecha_limite ? tarea.fecha_limite.split('T')[0] : '';

  const btn = document.querySelector('.task-form .btn');
  btn.textContent = 'Guardar cambios';
  btn.onclick = () => saveEdit(id);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function saveEdit(id) {
  const titulo = document.getElementById('titulo').value;
  const descripcion = document.getElementById('descripcion').value;
  const prioridad = document.getElementById('prioridad').value;
  const fecha_limite = document.getElementById('fecha_limite').value;

  if (!titulo) {
    alert('El título es obligatorio');
    return;
  }

  await fetch(`${API}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', authorization: token },
    body: JSON.stringify({ titulo, descripcion, prioridad, fecha_limite })
  });

  const btn = document.querySelector('.task-form .btn');
  btn.textContent = 'Agregar tarea';
  btn.onclick = createTask;

  document.getElementById('titulo').value = '';
  document.getElementById('descripcion').value = '';
  document.getElementById('fecha_limite').value = '';

  loadTasks();
}

function showTab(tab) {
  tabActual = tab;
  document.getElementById('listaPendientes').style.display = tab === 'pendientes' ? 'block' : 'none';
  document.getElementById('listaCompletadas').style.display = tab === 'completadas' ? 'block' : 'none';
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = 'index.html';
}

loadTasks();