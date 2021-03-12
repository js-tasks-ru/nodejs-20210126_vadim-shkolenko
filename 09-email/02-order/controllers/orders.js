const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;

  const order = await Order.create({product, phone, address, user: ctx.user});
  await order.populate('product').execPopulate();

  const options = {
    template: 'order-confirmation',
    locals: {id: order._id, product},
    to: ctx.user.email,
    subject: 'Подтвердите заказ',
  };

  await sendMail(options);

  ctx.body = {order: order._id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user._id}).populate('product');
  ctx.body = {orders: orders.map(mapOrder)};
};
