const Product = require('../models/Product');
const convertToObject = require('../utils/convertObject');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.query.query;

  if (!query) return next();

  const products = await Product.find({$text: {$search: query}}).limit(20);
  const convertedProducts = products.map((item) => convertToObject(item));
  ctx.body = {products: convertedProducts};
};
