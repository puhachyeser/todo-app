const Task = require('../models/Task');

class TaskController {
  async create(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is empty" });
      }

      const { title, description } = req.body;

      if (!title || title.trim() === "") {
        return res.status(400).json({ message: "Title is required and cannot be empty" });
      }

      const task = await Task.create({ 
        title: title.trim(), 
        description: description ? description.trim() : "", 
        userId: req.user.id 
      });
      
      return res.status(201).json(task);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error while creating task" });
    }
  }

  async getAll(req, res) {
    try {
      const { status } = req.query;
      const where = { userId: req.user.id };
      
      const allowedStatuses = ['todo', 'in progress', 'done'];
      if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({ message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
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
      console.error(e);
      res.status(500).json({ message: "Error while retrieving tasks" });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) return res.status(400).json({ message: "Task ID is required" });

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is empty" });
      }

      const { title, description, status } = req.body;
      
      const task = await Task.findOne({ where: { id, userId: req.user.id } });
      if (!task) return res.status(404).json({ message: "Task is not found" });

      const allowedStatuses = ['todo', 'in progress', 'done'];
      if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      if (title !== undefined) task.title = title.trim();
      if (description !== undefined) task.description = description.trim();
      if (status !== undefined) task.status = status;

      await task.save();
      return res.json(task);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error while updating task" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: "Valid Task ID is required" });
      }

      const task = await Task.findOne({ where: { id, userId: req.user.id } });
      if (!task) return res.status(404).json({ message: "Task is not found" });

      await task.destroy();
      return res.json({ message: "Task successfully deleted" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error while deleting task" });
    }
  }
}

module.exports = new TaskController();