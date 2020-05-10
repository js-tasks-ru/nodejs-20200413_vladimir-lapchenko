const Category = require("../models/Category");

module.exports.categoryList = async function categoryList(ctx, next) {
  const dbRecords = await Category.find({});
  const categories = dbRecords.map((c) => c.map());
  ctx.body = { categories };
};
