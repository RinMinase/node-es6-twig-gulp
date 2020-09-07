// require('./public/stylesheets/style.scss');
// import './public/scss/index.css';

import app from './src/app'
import debugLibrary from 'debug';
import http from 'http';

const debug = debugLibrary('nodejs-es6-twig-gulp:server');
const port = parseInt(process.env.PORT) || '3000';

app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') throw error;

  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${port} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`Port ${port} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug('Listening on ' + bind);
}
