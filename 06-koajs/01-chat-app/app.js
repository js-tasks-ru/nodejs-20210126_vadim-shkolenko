const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

class UsersStorage {
  constructor() {
    this.subscribers = [];
  }

  subscribe(user) {
    this.subscribers.push(user);
  }

  unsubscribe(id) {
    this.subscribers.filter((user) => user.id !== id);
  }
}

const users = new UsersStorage();

router.get('/subscribe', async (ctx) => {
  await new Promise((resolve) => {
    const id = ctx.query.r;
    users.subscribe({id, ctx, resolve});

    ctx.req.on('aborted', () => {
      users.unsubscribe(id);
      resolve();
    });
  });
});

router.post('/publish', (ctx) => {
  const message = ctx.request.body.message;
  if (message) {
    users.subscribers.forEach((user) => {
      user.ctx.body = ctx.request.body.message;
      user.resolve();
    });
    ctx.status = 200;
  }
});

app.use(router.routes());

module.exports = app;
