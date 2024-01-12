// Import dotenv and run its configurations
require('dotenv').config();

// Import App.js
const app = require('./app');

const { sequelize } = require('./models');
const db = require('./utils/db');

// Check Database Connection
db.checkConnection(sequelize);

// Synchronize Database
// db.syncDB(sequelize); //? Create if not exist
// db.forceSyncDB(sequelize); //? Drop and create

// Start Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Error Handling
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
