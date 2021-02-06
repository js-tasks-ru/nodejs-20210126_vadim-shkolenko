const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  res.on('error', () => {
    res.statusCode = 500;
    res.end('Something went wrong');
  });

  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.split('/').length > 1) {
    res.statusCode = 400;
    res.end('Wrong path');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (fs.existsSync(filepath)) {
        fs.createReadStream(filepath).pipe(res);
      } else {
        res.statusCode = 404;
        res.end('Not found');
      }
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
