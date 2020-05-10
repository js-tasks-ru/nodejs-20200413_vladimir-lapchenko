const mongoose = require("mongoose");
const connection = require("../libs/connection");

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
});

categorySchema.methods.map = function () {
  const subcategories = this.subcategories.map((s) => ({
    id: s.id,
    title: s.title,
  }));
  return {
    id: this.id,
    title: this.title,
    subcategories,
  };
};

module.exports = connection.model("Category", categorySchema);
