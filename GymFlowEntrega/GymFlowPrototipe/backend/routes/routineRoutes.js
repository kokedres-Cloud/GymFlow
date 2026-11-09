const express = require('express');
const router = express.Router();
const routineController = require('../controllers/routineController');
const auth = require('../middlewares/auth');

// Todas las operaciones de rutinas requieren autenticación JWT
router.use(auth);

router.get('/', routineController.getMyRoutines);
router.get('/:id', routineController.getRoutineById);
router.post('/', routineController.createRoutine);
router.put('/:id', routineController.updateRoutine);
router.delete('/:id', routineController.removeRoutine);

module.exports = router;

