const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Wrong path');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  if (!fs.existsSync(filepath)) {
    res.statusCode = 404;
    res.end('File not found');
    return;
  }

  switch (req.method) {
    case 'DELETE':
      fs.unlinkSync(filepath);
      res.statusCode = 200;
      res.end('File deleted');
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
