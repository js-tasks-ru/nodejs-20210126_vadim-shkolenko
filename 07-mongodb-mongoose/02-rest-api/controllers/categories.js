const Category = require('../models/Category');
const convertObject = require('../utils/convertObject');


module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({});
  const converted = [];
  categories.forEach((category) => {
    const convertedSubCategories = [];
    category.subcategories
        .forEach((subCategory) => {
          convertedSubCategories.push(convertObject(subCategory));
        });
    converted.push({...convertObject(category), subcategories: convertedSubCategories});
  });

  ctx.body = {categories: converted};
};
