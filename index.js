const {initializeDatabase, initializeWebServer} = require('./server');

initializeDatabase();
initializeWebServer(9080);
