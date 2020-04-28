const url = require("url");
const http = require("http");
const path = require("path");
const fs = require("fs");
const LimitSizeStream = require("./LimitSizeStream");

const server = new http.Server();

server.on("request", (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, "files", pathname);

  switch (req.method) {
    case "POST": {
      if (pathname.includes("/") || pathname.includes("..")) {
        res.statusCode = 400;
        res.end();
        return;
      }

      const limitSizeStream = new LimitSizeStream({ limit: 1024 * 1024 });
      const file = fs.createWriteStream(filepath, { flags: "wx" });

      limitSizeStream.on("error", (error) => {
        res.statusCode = 413;
        res.end(error.message);
        file.end();
        fs.unlinkSync(filepath);
      });

      file.on("error", (error) => {
        res.statusCode = 409;
        res.end();
      });

      file.on("finish", () => {
        if (res.finished) return;
        res.statusCode = 201;
        res.end();
      });

      res.on("close", () => {
        if (res.finished) return;
        limitSizeStream.destroy();
        file.destroy();
        fs.unlinkSync(filepath);
      });

      req.pipe(limitSizeStream).pipe(file);

      break;
    }

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});

module.exports = server;
