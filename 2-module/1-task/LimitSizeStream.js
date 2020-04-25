const { Transform } = require("stream");
const LimitExceededError = require("./LimitExceededError");

class LimitSizeStream extends Transform {
  #limit = 0;
  #length = 0;

  constructor(options) {
    super(options);
    this.#limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.#length += chunk.length;
    if (this.#length > this.#limit) {
      this.emit("error", new LimitExceededError());
      // this.destroy(new LimitExceededError());
    } else {
      this.push(chunk.toString());
      callback();
    }
  }
}

module.exports = LimitSizeStream;
