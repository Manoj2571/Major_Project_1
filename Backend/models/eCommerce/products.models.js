const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    productType: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0
    },
    isWishlisted: {
      type: Number,
      default: 0
    },
    inCart: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      required: true
    },
    tags: [{
      type: String
    }]
  }, {timeStamps: true}
)

const Product = mongoose.model("Product", productSchema)

module.exports = Product