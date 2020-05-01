const path = require("path");
const Koa = require("koa");
const EventEmitter = require("events");

const app = new Koa();
const ee = new EventEmitter();

app.use(require("koa-static")(path.join(__dirname, "public")));
app.use(require("koa-bodyparser")());

const Router = require("koa-router");
const router = new Router();

router.get("/subscribe", async (ctx, next) => {
  const promise = new Promise((resolve) => {
    ee.on("message", (msg) => {
      resolve(msg);
    });
  });
  ctx.response.body = await promise;
  return next();
});

router.post("/publish", async (ctx, next) => {
  const { message } = ctx.request.body;
  if (message) {
    ee.emit("message", message);
  }
  ctx.response.body = "";
  return next();
});

app.use(router.routes());

module.exports = app;
