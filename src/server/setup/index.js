const dbConnection = require('./db');
const dbConfig = require('./db/config.js');

const setup = async () => {
  await dbConnection.connect(dbConfig);
  console.log('DB Connected');
  await require('./server.js');
  console.log('Server Connected');
};

setup();
