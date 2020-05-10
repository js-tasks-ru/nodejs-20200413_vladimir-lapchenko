const mongoose = require("mongoose");
const connection = require("../libs/connection");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  images: [String],
});

productSchema.methods.map = function () {
  return {
    id: this.id,
    title: this.title,
    images: this.images,
    category: this.category,
    subcategory: this.subcategory,
    price: this.price,
    description: this.description,
  };
};

module.exports = connection.model("Product", productSchema);
