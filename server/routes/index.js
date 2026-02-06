const Router = require('express');
const router = new Router();
const authRouter = require('./auth');
const taskRouter = require('./tasks');

router.use('/auth', authRouter);
router.use('/tasks', taskRouter);

module.exports = router;