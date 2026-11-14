const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email y password son obligatorios' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    if (err.name && err.name.startsWith('Sequelize') && err.errors) {
      return res.status(400).json({ message: err.errors.map((e) => e.message).join(', ') });
    }
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email y password son obligatorios' });
    }

    const user = await User.findOne({ where: { email } });
    // Mismo mensaje para usuario inexistente y password incorrecto
    // (no revelamos cuál de los dos falló)
    const valid = user && (await bcrypt.compare(password, user.password));
    if (!valid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    return res.json({ message: 'Login exitoso', token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
