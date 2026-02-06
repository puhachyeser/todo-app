const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const User = require('./models/User');
const Task = require('./models/Task');

const app = express();
app.use(cors());
app.use(express.json());

User.hasMany(Task);
Task.belongsTo(User);

const start = async () => {
  try {
    await sequelize.sync({ alter: true });
    app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();