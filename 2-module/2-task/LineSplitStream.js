const stream = require("stream");
const os = require("os");

class LineSplitStream extends stream.Transform {
  #lastLine = "";

  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    let text = chunk.toString();
    if (this.#lastLine) {
      text = this.#lastLine + text;
    }
    const lines = text.split(os.EOL);
    this.#lastLine = lines.pop();
    lines.forEach((line) => {
      this.push(line);
    });
    callback();
  }

  _flush(callback) {
    if (this.#lastLine) {
      this.push(this.#lastLine);
    }
    callback();
  }
}

module.exports = LineSplitStream;
