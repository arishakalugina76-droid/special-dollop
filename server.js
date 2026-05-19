const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Загрузка всех заданий
function loadTasks() {
  try {
    if (fs.existsSync(TASKS_FILE)) {
      return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Ошибка чтения tasks.json:', e);
  }
  return {};
}

// Сохранение всех заданий
function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

// Создание или обновление задания
app.post('/api/tasks', (req, res) => {
  const { id, type, title, data } = req.body;
  const tasks = loadTasks();
  let taskId = id;
  if (!taskId) {
    // Генерируем короткий ID (6 символов)
    taskId = crypto.randomBytes(3).toString('hex');
    while (tasks[taskId]) {
      taskId = crypto.randomBytes(3).toString('hex');
    }
  }
  tasks[taskId] = {
    id: taskId,
    type,
    title,
    data,
    updatedAt: new Date().toISOString()
  };
  saveTasks(tasks);
  res.json({ id: taskId });
});

// Получение задания по ID
app.get('/api/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const task = tasks[req.params.id];
  if (!task) {
    return res.status(404).json({ error: 'Задание не найдено' });
  }
  res.json(task);
});

// Короткая ссылка – отдаём HTML для игры
app.get('/task/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Для Render и локального запуска
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Загрузка всех заданий
function loadTasks() {
  try {
    if (fs.existsSync(TASKS_FILE)) {
      return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Ошибка чтения tasks.json:', e);
  }
  return {};
}

// Сохранение всех заданий
function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

// Создание или обновление задания
app.post('/api/tasks', (req, res) => {
  const { id, type, title, data } = req.body;
  const tasks = loadTasks();
  let taskId = id;
  if (!taskId) {
    // Генерируем короткий ID (6 символов)
    taskId = crypto.randomBytes(3).toString('hex');
    while (tasks[taskId]) {
      taskId = crypto.randomBytes(3).toString('hex');
    }
  }
  tasks[taskId] = {
    id: taskId,
    type,
    title,
    data,
    updatedAt: new Date().toISOString()
  };
  saveTasks(tasks);
  res.json({ id: taskId });
});

// Получение задания по ID
app.get('/api/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const task = tasks[req.params.id];
  if (!task) {
    return res.status(404).json({ error: 'Задание не найдено' });
  }
  res.json(task);
});

// Короткая ссылка – отдаём HTML для игры
app.get('/task/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Для Render и локального запуска
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});
