const classListElement = document.getElementById('classList');
const classForm = document.getElementById('classForm');
const newClassBtn = document.getElementById('newClassBtn');
const messageElement = document.getElementById('message');

const fechaInput = document.getElementById('fecha');
const nombreInput = document.getElementById('nombre');
const contenidoInput = document.getElementById('contenido');

let classes = [];
let selectedClassId = null;

function formatDate(dateValue) {
  const date = new Date(dateValue);
  return date.toLocaleDateString('es-ES');
}

function setMessage(text, type = '') {
  messageElement.textContent = text;
  messageElement.className = `message ${type}`.trim();
}

function resetForm() {
  selectedClassId = null;
  classForm.reset();
  const today = new Date().toISOString().split('T')[0];
  fechaInput.value = today;
  nombreInput.focus();
  renderClassList();
  setMessage('');
}

function selectClass(classItem) {
  selectedClassId = classItem.id;
  fechaInput.value = classItem.fecha.split('T')[0];
  nombreInput.value = classItem.nombre;
  contenidoInput.value = classItem.contenido;
  setMessage(`Editando: ${classItem.nombre}`);
  renderClassList();
}

function renderClassList() {
  classListElement.innerHTML = '';

  if (classes.length === 0) {
    classListElement.innerHTML = '<li>No hay clases guardadas.</li>';
    return;
  }

  classes.forEach((classItem) => {
    const li = document.createElement('li');
    li.className = `class-item ${selectedClassId === classItem.id ? 'active' : ''}`.trim();
    li.innerHTML = `
      <div class="class-item-title">${classItem.nombre}</div>
      <div class="class-item-date">${formatDate(classItem.fecha)}</div>
    `;
    li.addEventListener('click', () => selectClass(classItem));
    classListElement.appendChild(li);
  });
}

async function loadClasses() {
  const response = await fetch('/api/clases');
  if (!response.ok) {
    throw new Error('No se pudieron cargar las clases.');
  }

  classes = await response.json();
  renderClassList();
}

async function saveClass(event) {
  event.preventDefault();

  const payload = {
    nombre: nombreInput.value.trim(),
    fecha: fechaInput.value,
    contenido: contenidoInput.value.trim(),
  };

  if (!payload.nombre || !payload.fecha || !payload.contenido) {
    setMessage('Completa todos los campos para guardar.', 'error');
    return;
  }

  try {
    const response = await fetch('/api/clases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'No se pudo guardar la clase.');
    }

    setMessage(`Clase "${data.nombre}" guardada correctamente.`, 'success');
    await loadClasses();

    const refreshed = classes.find((item) => item.id === data.id);
    if (refreshed) {
      selectClass(refreshed);
    }
  } catch (error) {
    setMessage(error.message, 'error');
  }
}

newClassBtn.addEventListener('click', resetForm);
classForm.addEventListener('submit', saveClass);

(async function init() {
  try {
    resetForm();
    await loadClasses();
  } catch (error) {
    setMessage(error.message, 'error');
  }
})();
