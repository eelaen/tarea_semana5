const { Task } = require('../models');

const VALID_STATUS = ['pending', 'in-progress', 'completed'];

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['id', 'DESC']],
    });
    return res.json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'title es obligatorio' });
    }
    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ message: `status debe ser: ${VALID_STATUS.join(', ')}` });
    }

    // userId sale del token, nunca del body
    const task = await Task.create({ title, description, status, userId: req.user.id });
    return res.status(201).json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ message: `status debe ser: ${VALID_STATUS.join(', ')}` });
    }

    // Buscar por id Y userId: así nadie toca tareas ajenas
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    await task.update({
      title: title ?? task.title,
      description: description ?? task.description,
      status: status ?? task.status,
    });
    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    await task.destroy();
    return res.json({ message: 'Tarea eliminada correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
