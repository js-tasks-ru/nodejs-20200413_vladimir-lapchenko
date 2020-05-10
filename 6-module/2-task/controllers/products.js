const mongoose = require("mongoose");
const Product = require("../models/Product");
const ObjectId = mongoose.Types.ObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(
  ctx,
  next
) {
  const { subcategory } = ctx.request.query;
  let dbRecords = [];
  if (subcategory) {
    dbRecords = await Product.find({ subcategory });
  } else {
    dbRecords = await Product.find({});
  }
  const products = dbRecords.map((p) => p.map());
  ctx.body = { products };
};

module.exports.productList = async function productList(ctx, next) {
  const dbRecords = await Product.find({});
  const products = dbRecords.map((r) => r.map());
  ctx.body = { products };
  return next();
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  if (!ObjectId.isValid(id)) {
    ctx.throw(400, "Invalid identifier");
  }

  const products = await Product.find({ _id: id });
  if (!products.length) {
    ctx.throw(404, "Product not found");
  }

  const product = products[0].map();
  ctx.body = { product };
};
