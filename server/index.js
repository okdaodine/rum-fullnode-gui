const Koa = require('koa');
const http = require('http');
const serve = require('koa-static');
const views = require('koa-views');

const app = new Koa();
const port = 9000;

app.use(views(__dirname + '/build'));
app.use(serve('build', {
  maxage: 365 * 24 * 60 * 60,
  gzip: true
}));

app.on('error', function (err) {
  console.log(err)
});

const server = http.createServer(app.callback());
server.listen(port, () => {
  console.log(`Node.js v${process.versions.node}`);
  console.log(`Server run at ${port}`);
});
