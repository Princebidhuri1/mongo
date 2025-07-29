require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'high', 'urgent'],
    default: 'low'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', taskSchema);

async function getTasksAndRender(res, message = null) {
  try {
    const tasks = await Task.find({});
    console.log(`Found ${tasks.length} tasks`);
    res.render('index', { tasks, message });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.render('index', { tasks: [], message: 'Error loading tasks. Please try again.' });
  }
}

app.get('/', async (req, res) => {
  console.log('GET / - Loading homepage');
  await getTasksAndRender(res);
});

app.post('/add', async (req, res) => {
  const { title, priority } = req.body;
  console.log('POST /add - Adding new task:', { title, priority });

  if (!title || title.trim() === '') {
    console.log('Task creation failed: empty title');
    return await getTasksAndRender(res, 'Task title cannot be empty!');
  }

  try {
    const newTask = await Task.create({ title: title.trim(), priority });
    console.log('Task created successfully:', newTask._id);
    res.redirect('/');
  } catch (error) {
    console.error('Error adding task:', error);
    await getTasksAndRender(res, 'Error adding task. Please try again.');
  }
});

app.put('/edit/:id', async (req, res) => {
  const taskId = req.params.id;
  const newPriority = req.body.priority;
  console.log(`PUT /edit/${taskId} - Updating priority to:`, newPriority);

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { priority: newPriority },
      { new: true }
    );

    if (!updatedTask) {
      console.log('Task not found for update:', taskId);
      return res.json({ success: false, message: 'Task not found.' });
    }

    console.log('Task updated successfully:', updatedTask._id);
    res.json({ success: true, message: 'Task updated successfully!', task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.json({ success: false, message: 'Error updating task. Please try again.' });
  }
});

app.delete('/delete/:id', async (req, res) => {
  const taskId = req.params.id;
  console.log(`DELETE /delete/${taskId} - Deleting task`);

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      console.log('Task not found for deletion:', taskId);
      return res.json({ success: false, message: 'Task not found.' });
    }

    console.log('Task deleted successfully:', deletedTask._id);
    res.json({ success: true, message: 'Task deleted successfully!' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.json({ success: false, message: 'Error deleting task. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
