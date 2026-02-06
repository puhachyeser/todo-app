const Router = require('express');
const router = new Router();
const taskController = require('../controllers/tasks');
const authMiddleware = require('../middleware/authentication');

router.use(authMiddleware);

router.post('/', taskController.create);
router.get('/', taskController.getAll);
router.patch('/:id', taskController.update);
router.delete('/:id', taskController.delete);

module.exports = router;