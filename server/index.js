const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const User = require('./models/User');
const Task = require('./models/Task');
const router = require('./routes/index');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

const start = async () => {
  try {
    await sequelize.sync({ alter: true });
    app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();