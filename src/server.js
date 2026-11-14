require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL exitosa');

    // Crea las tablas si no existen (alternativa: ejecutar database/schema.sql)
    await sequelize.sync();

    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  } catch (err) {
    console.error('No se pudo iniciar el servidor:', err.message);
    process.exit(1);
  }
})();
