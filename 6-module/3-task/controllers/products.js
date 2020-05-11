const Product = require("../models/Product");

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const { query } = ctx.query;
  const dbRecords = await Product.find(
    {
      $text: { $search: query },
    },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });
  const products = dbRecords.map((r) => r.map());
  ctx.body = { products };
};
