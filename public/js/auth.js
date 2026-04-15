const API = 'http://localhost:3000/api';

async function login() {
  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;
  const errorMsg = document.getElementById('errorMsg');

  if (!correo || !contrasena) {
    showError(errorMsg, 'Por favor completa todos los campos');
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
    });

    const data = await res.json();

    if (!res.ok) {
      showError(errorMsg, data.message);
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    window.location.href = 'tasks.html';

  } catch (err) {
    showError(errorMsg, 'Error al conectar con el servidor');
  }
}

async function register() {
  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;
  const errorMsg = document.getElementById('errorMsg');
  const successMsg = document.getElementById('successMsg');

  if (!nombre || !correo || !contrasena) {
    showError(errorMsg, 'Por favor completa todos los campos');
    return;
  }

  if (contrasena.length < 8) {
    showError(errorMsg, 'La contraseña debe tener al menos 8 caracteres');
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, contrasena })
    });

    const data = await res.json();

    if (!res.ok) {
      showError(errorMsg, data.message);
      return;
    }

    errorMsg.style.display = 'none';
    successMsg.textContent = 'Cuenta creada exitosamente. Redirigiendo...';
    successMsg.style.display = 'block';

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);

  } catch (err) {
    showError(errorMsg, 'Error al conectar con el servidor');
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = 'index.html';
}

function showError(el, msg) {
  el.textContent = msg;
  el.style.display = 'block';
}