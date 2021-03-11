const {v4: uuid} = require('uuid');
const User = require('../models/User');
const Session = require('../models/Session');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {email, password, displayName} = ctx.request.body;
  const verificationToken = uuid();

  const user = await User.findOne({email});

  if (user) {
    ctx.status = 400;
    ctx.body = {errors: {email: 'Такой email уже существует'}};
    return;
  }

  const u = new User({email, password, displayName, verificationToken});
  await u.setPassword(password);
  await u.save();

  const options = {
    template: 'confirmation',
    locals: {token: verificationToken},
    to: email,
    subject: 'Подтвердите почту',
  };

  await sendMail(options);

  ctx.status = 200;
  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const verificationToken = ctx.request.body.verificationToken;

  const user = await User.findOneAndUpdate({verificationToken}, {$unset: {verificationToken}},
  );

  if (user) {
    const token = await ctx.login(user);

    ctx.body = {token};
  } else {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
  }
};
