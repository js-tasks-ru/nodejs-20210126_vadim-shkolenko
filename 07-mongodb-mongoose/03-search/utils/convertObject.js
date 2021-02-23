const convertObject = (item) => {
  const obj = item.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

module.exports = convertObject;
