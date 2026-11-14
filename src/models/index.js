const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');

// Relaciones: User 1 --- N Task
User.hasMany(Task, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false } });

module.exports = { sequelize, User, Task };
