// DOM Elements
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const addTodoForm = document.getElementById('addTodoForm');
const todosList = document.getElementById('todosList');
const logoutBtn = document.getElementById('logoutBtn');
const usernameDisplay = document.getElementById('username-display');
const filterButtons = document.querySelectorAll('.filter-btn');

// Constants
const API_BASE_URL = 'http://localhost:3000';
const AUTH_TOKEN_KEY = 'auth_token';
const USERNAME_KEY = 'username';

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token && window.location.pathname !== '/index.html' && window.location.pathname !== '/login.html') {
        window.location.href = '/login.html';
    }
}

// Set up axios defaults
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`;

// Signup Handler
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
                username,
                password
            });

            if (response.status === 201) {
                alert('Signup successful! Please login.');
                window.location.href = '/login.html';
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Signup failed');
        }
    });
}

// Login Handler
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                username,
                password
            });

            if (response.data.token) {
                localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
                localStorage.setItem(USERNAME_KEY, username);
                window.location.href = '/dashboard.html';
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');
        }
    });
}

// Logout Handler
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USERNAME_KEY);
        window.location.href = '/login.html';
    });
}

// Display Username
if (usernameDisplay) {
    const username = localStorage.getItem(USERNAME_KEY);
    if (username) {
        usernameDisplay.textContent = `Welcome, ${username}`;
    }
}

// Todo Functions
async function fetchTodos() {
    try {
        const response = await axios.get(`${API_BASE_URL}/todos`);
        return response.data;
    } catch (error) {
        console.error('Error fetching todos:', error);
        return [];
    }
}

async function addTodo(title) {
    try {
        const response = await axios.post(`${API_BASE_URL}/todos`, { title });
        return response.data.todo;
    } catch (error) {
        console.error('Error adding todo:', error);
        throw error;
    }
}

async function updateTodo(id, updates) {
    try {
        const response = await axios.put(`${API_BASE_URL}/todos/${id}`, updates);
        return response.data.todo;
    } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
    }
}

async function deleteTodo(id) {
    try {
        await axios.delete(`${API_BASE_URL}/todos/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
}

// Render Todos
function renderTodos(todos, filter = 'all') {
    if (!todosList) return;

    todosList.innerHTML = '';

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    filteredTodos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.className = 'todo-item';
        todoElement.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} />
      <h3 class="todo-title ${todo.completed ? 'completed' : ''}">${todo.title}</h3>
      <div class="todo-actions">
        <button class="delete-btn">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

        // Add event listeners
        const checkbox = todoElement.querySelector('.todo-checkbox');
        const deleteBtn = todoElement.querySelector('.delete-btn');

        checkbox.addEventListener('change', async () => {
            try {
                await updateTodo(todo.id, { completed: checkbox.checked });
                const title = todoElement.querySelector('.todo-title');
                title.classList.toggle('completed', checkbox.checked);
            } catch (error) {
                alert('Error updating todo');
            }
        });

        deleteBtn.addEventListener('click', async () => {
            try {
                await deleteTodo(todo.id);
                todoElement.remove();
            } catch (error) {
                alert('Error deleting todo');
            }
        });

        todosList.appendChild(todoElement);
    });
}

// Add Todo Handler
if (addTodoForm) {
    addTodoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('newTodo');
        const title = input.value.trim();

        if (title) {
            try {
                await addTodo(title);
                input.value = '';
                const todos = await fetchTodos();
                renderTodos(todos);
            } catch (error) {
                alert('Error adding todo');
            }
        }
    });
}

// Filter Handler
if (filterButtons) {
    filterButtons.forEach(button => {
        button.addEventListener('click', async () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;
            const todos = await fetchTodos();
            renderTodos(todos, filter);
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();

    if (todosList) {
        const todos = await fetchTodos();
        renderTodos(todos);
    }
});
