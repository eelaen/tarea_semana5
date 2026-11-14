const router = require('express').Router();
const auth = require('../middleware/auth');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/task.controller');

// Todas las rutas de tareas requieren JWT
router.use(auth);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
