const url = require("url");
const http = require("http");
const path = require("path");
const fs = require("fs");

const server = new http.Server();

server.on("request", (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, "files", pathname);

  switch (req.method) {
    case "GET": {
      if (pathname === "favicon.ico") {
        res.end();
        return;
      }

      const pathParts = pathname.split("/");
      if (pathParts.length > 1) {
        res.statusCode = 400;
        res.end("nested directories");
        return;
      }

      fs.stat(filepath, (err, stat) => {
        if (err) {
          res.statusCode = err.code === "ENOENT" ? 404 : 500;
          res.end();
          return;
        }
        if (!stat.isFile()) {
          res.statusCode = 400;
          res.end("not a file");
          return;
        }

        const file = new fs.ReadStream(filepath);
        file.pipe(res);

        res.on("close", () => {
          file.destroy();
        });
      });

      break;
    }

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});

module.exports = server;
