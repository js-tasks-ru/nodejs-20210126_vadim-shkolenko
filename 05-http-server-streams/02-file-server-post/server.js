const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Wrong path');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    res.end('File already exist');
    return;
  }

  switch (req.method) {
    case 'POST':
      const writeStream = fs.createWriteStream(filepath);

      req
          .pipe(new LimitSizeStream({limit: 1000000}))
          .on('error', (error) => {
            res.statusCode = 413;
            res.end(error.message);
            fs.unlinkSync(filepath);
          })
          .pipe(writeStream)
          .on('error', (error) => {
            res.statusCode = 500;
            res.end(error.message);
          });

      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end('File created');
      });

      req.on('aborted', () => {
        writeStream.destroy();
        fs.unlinkSync(filepath);
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
