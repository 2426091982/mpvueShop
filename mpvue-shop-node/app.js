const Koa = require("koa");
const app = new Koa();
const config = require("./config");
const router = require("./router/index");
const bodyParser = require("koa-bodyparser");

// 解析请求体
app.use(bodyParser());
app.use(router.routes());

app.listen(config.port, () => {
  console.log(`server is started at port ${config.port}`);
});
