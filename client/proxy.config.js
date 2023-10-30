const configuration = require('./configuration.dev');
const BACKEND_URL = configuration.BACKEND_URL;
const BACKEND_PORT = configuration.BACKEND_PORT;
const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: `${BACKEND_URL}${BACKEND_PORT ? ':' : ''}${BACKEND_PORT}`,
    // changeOrigin: true,
    secure: false,
    logLevel: "debug"
  }    
];

module.exports = PROXY_CONFIG;