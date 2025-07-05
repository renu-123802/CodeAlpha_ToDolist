/* ========= DOM elements ========= */
const todoForm  = document.getElementById('todo‑form');
const todoInput = document.getElementById('todo‑input');
const todoList  = document.getElementById('todo‑list');

/* ========= State (array of objects) & localStorage key ========= */
const STORAGE_KEY = 'codealpha_todos';
let todos = loadFromStorage();

/* ========= Initial render ========= */
renderTodos();

/* ========= Event: Add new task ========= */
todoForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  const newTodo = {
    id: Date.now(),
    text,
    completed: false
  };
  todos.push(newTodo);
  saveAndRender();
  todoInput.value = '';
});

/* ========= Event delegation for actions (edit, delete, toggle) ========= */
todoList.addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;
  const id = Number(li.dataset.id);
  const todo = todos.find(t => t.id === id);

  /* Toggle completed */
  if (e.target.classList.contains('toggle‑btn')) {
    todo.completed = !todo.completed;
    saveAndRender();
  }

  /* Delete */
  if (e.target.classList.contains('delete‑btn')) {
    todos = todos.filter(t => t.id !== id);
    saveAndRender();
  }

  /* Edit */
  if (e.target.classList.contains('edit‑btn')) {
    const newText = prompt('Edit task:', todo.text);
    if (newText !== null) {
      todo.text = newText.trim() || todo.text; // keep old text if input empty
      saveAndRender();
    }
  }
});

/* ========= Helper: Save → localStorage & Render ========= */
function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  renderTodos();
}

/* ========= Helper: Load from localStorage ========= */
function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/* ========= Helper: Render list ========= */
function renderTodos() {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    todoList.innerHTML = '<p style="text-align:center;color:#666;">No tasks yet!</p>';
    return;
  }

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    li.className = todo.completed ? 'completed' : '';

    /* Task text */
    const span = document.createElement('span');
    span.textContent = todo.text;

    /* Action buttons */
    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.innerHTML = `
      <button class="toggle‑btn">${todo.completed ? 'Undo' : 'Done'}</button>
      <button class="edit‑btn">Edit</button>
      <button class="delete‑btn">Delete</button>
    `;

    li.appendChild(span);
    li.appendChild(actions);
    todoList.appendChild(li);
  });
}
