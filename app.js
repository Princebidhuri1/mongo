const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: { type: String, enum: ['low', 'high', 'urgent'], default: 'low' }
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.render('index', { tasks, message: null });
  } catch (error) {
    res.render('index', { tasks: [], message: 'Error loading tasks' });
  }
});

app.post('/add', async (req, res) => {
  const { title, priority } = req.body;
  
  if (!title || title.trim() === '') {
    const tasks = await Task.find({});
    return res.render('index', { tasks, message: 'Task title cannot be empty!' });
  }

  try {
    await Task.create({ title: title.trim(), priority });
    res.redirect('/');
  } catch (error) {
    const tasks = await Task.find({});
    res.render('index', { tasks, message: 'Error adding task' });
  }
});

app.put('/edit/:id', async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { priority: req.body.priority });
    res.json({ success: true, message: 'Task updated successfully!' });
  } catch (error) {
    res.json({ success: false, message: 'Error updating task' });
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Task deleted successfully!' });
  } catch (error) {
    res.json({ success: false, message: 'Error deleting task' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
