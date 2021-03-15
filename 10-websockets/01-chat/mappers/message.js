module.exports = (message) => ({
  date: message.date,
  text: message.text,
  id: message._id,
  user: message.user,
});
