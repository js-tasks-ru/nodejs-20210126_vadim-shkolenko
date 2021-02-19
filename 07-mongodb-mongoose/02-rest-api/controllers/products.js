const mongoose = require('mongoose');
const Product = require('../models/Product');
const convertObject = require('../utils/convertObject');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const id = ctx.query.subcategory;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = 'invalid id';
    return;
  }

  const products = await Product.find({subcategory: id});
  const converted = [];
  products.forEach((item) => converted.push(convertObject(item)));

  ctx.products = converted;

  await next();
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {products: ctx.products};

  await next();
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = 'invalid id';
    return;
  }

  const product = await Product.findById(id);

  if (!product) {
    ctx.status = 404;
    ctx.body = 'Not Found';
    return;
  }

  ctx.body = {product: convertObject(product)};

  await next();
};

