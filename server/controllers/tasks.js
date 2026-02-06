const Task = require('../models/Task');
const ApiError = require('../utils/api-error');

class TaskController {
  async create(req, res, next) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return next(ApiError.badRequest("Request body is empty"));
      }

      const { title, description } = req.body;

      if (!title || title.trim() === "") {
        return next(ApiError.badRequest("Title is required"));
      }

      const task = await Task.create({ 
        title: title.trim(), 
        description: description ? description.trim() : "", 
        userId: req.user.id 
      });
      
      return res.status(201).json(task);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const { status } = req.query;
      const where = { userId: req.user.id };
      
      const allowedStatuses = ['todo', 'in progress', 'done'];
      if (status && !allowedStatuses.includes(status)) {
        return next(ApiError.badRequest(`Invalid status. Allowed: ${allowedStatuses.join(', ')}`));
      }

      if (status) {
        where.status = status;
      }

      const tasks = await Task.findAll({ 
        where,
        order: [['createdAt', 'DESC']]
      });
      return res.json(tasks);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return next(ApiError.badRequest("Valid Task ID is required"));
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return next(ApiError.badRequest("Request body is empty"));
      }

      const { title, description, status } = req.body;
      
      const task = await Task.findOne({ where: { id, userId: req.user.id } });
      if (!task) {
        return next(ApiError.notFound("Task is not found"));
      }

      const allowedStatuses = ['todo', 'in progress', 'done'];
      if (status && !allowedStatuses.includes(status)) {
        return next(ApiError.badRequest("Invalid status value"));
      }

      if (title !== undefined) task.title = title.trim();
      if (description !== undefined) task.description = description.trim();
      if (status !== undefined) task.status = status;

      await task.save();
      return res.json(task);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return next(ApiError.badRequest("Valid Task ID is required"));
      }

      const task = await Task.findOne({ where: { id, userId: req.user.id } });
      if (!task) {
        return next(ApiError.notFound("Task is not found"));
      }

      await task.destroy();
      return res.json({ message: "Task successfully deleted" });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new TaskController();