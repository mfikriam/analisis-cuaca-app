exports.syncDB = (sequelize) => {
  sequelize
    .sync()
    .sync({ force: true }) //? drop and create
    .then(() => {
      console.log('Synced MySQL Database');
    })
    .catch((err) => {
      console.log('Failed to sync db: ', err.message);
    });
};

exports.forceSyncDB = (sequelize) => {
  sequelize
    .sync({ force: true }) //? drop and create
    .then(() => {
      console.log('Drop and re-sync db');
    })
    .catch((err) => {
      console.log('Failed to drop and sync db: ', err.message);
    });
};

exports.checkConnection = (sequelize) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('MySQL Connection has been established successfully.');
    })
    .catch((error) => {
      console.error('Unable to connect to the database: ', error);
    });
};
