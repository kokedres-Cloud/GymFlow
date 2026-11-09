const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const auth = require('../middlewares/auth');

// Rutas públicas (cualquier usuario o visitante puede explorar los ejercicios)
router.get('/', exerciseController.getAll);
router.get('/:id', exerciseController.getById);

// Rutas administrativas / protegidas para crear, editar y eliminar ejercicios
router.post('/', auth, exerciseController.create);
router.put('/:id', auth, exerciseController.update);
router.delete('/:id', auth, exerciseController.remove);

module.exports = router;

