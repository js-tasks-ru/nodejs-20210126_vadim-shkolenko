const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.storage = '';
  }

  _transform(chunk, encoding, callback) {
    this.storage += chunk.toString();
    if (this.storage.includes(os.EOL)) {
      const lines = this.storage.split(os.EOL);

      this.storage = lines.pop();
      lines.forEach((data) => this.push(data));
    }
    callback();
  }

  _flush(callback) {
    if (this.storage) {
      this.push(this.storage);
    }

    callback();
  }
}

module.exports = LineSplitStream;
