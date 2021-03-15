const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  // сюда приходят данные с первого http запроса
  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;
    if (token) {
      let session;
      try {
        session = await Session.findOne({token}).populate('user');
      } catch (err) {
        next(new Error('Find session error'));
      }

      if (!session) {
        next(new Error('wrong or expired session token'));
      }

      session.lastVisit = new Date();
      await session.save();

      socket.user = session.user;
    } else {
      next(new Error('anonymous sessions are not allowed'));
    }
    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      try {
        await Message.create({
          date: new Date(),
          text: msg,
          chat: socket.user._id,
          user: socket.user.displayName,
        });
      } catch (err) {
        console.log(err.message);
      }
    });
  });

  return io;
}

module.exports = socket;
