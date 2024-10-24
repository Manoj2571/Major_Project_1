const { initializeDatabase } = require('./db/db.connect')
const express = require('express')
const Product = require('./models/eCommerce/products.models')
const Category = require('./models/eCommerce/categories.models')
const Address = require("./models/eCommerce/address.models")
const app = express()
const cors = require("cors");
require('dotenv').config()

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json())

initializeDatabase()

const port = process.env.PORT

app.listen(port, () => {
  console.log("Server is running on port number", port)
})

app.get("/categories", async (req, res) => {
  try {
    const categories = await getAllCategories()
    if(categories.length !== 0){
      res.send(categories)
    } else {
      res.status(404).json("Categories not found.")
    }
  } catch (error) {
    res.status(500).json("Failed to fetch Categories.")
  }
})

app.get("/categories/:categoryName", async (req, res) => {
  try {
    const productTypes = await findProductTypesByCategory(req.params.categoryName)
    if(productTypes.length != 0) {
      res.send(productTypes)
    } else {
      res.status(404).json("Product types not found.")
    }
  } catch (error) {
    res.status(500).json("Failed to fetch product types")
  }
})

app.get("/products/:categoryName", async (req, res) => {
  try {
    const products = await findProductsByCategory(req.params.categoryName)
    if(products.length != 0) {
      res.send(products)
    } else {
      res.status(404).json("No Products Found.")
    }
  } catch (error) {
    res.status(500).json("Failed to get products")
  }
})

app.get("/products", async (req, res) => {
  try {
    const products = await getAllProducts()
    if(products.length !== 0) {
      res.send(products)
    } else {
      res.status(404).json("Products not found.")
    }
  } catch (error) {
    res.status(500).json("Failed to fetch Products.")
  }
})

app.get("/products/:productId", async (req, res) => {
  try {
    const product = await getRequiredProduct(req.params.productId)
    product.length == 0 ? res.send(product) : res.status(404).json("Product not found.")
  } catch (error) {
    res.status(500).json("Failed to fetch required product.")
  }
})

app.post("/categories", async (req, res) => {
  try {
    const savedCategory = await addNewCategory(req.body)
    res.status(201).json({message: "Category added successfully", category: savedCategory})
  } catch (error) {
    res.status(500).json("Failed to post category.")
  } 
})

app.post("/products", async (req, res) => {
  try {
    const savedProduct = await addNewProduct(req.body)
    res.status(201).json({message: "Product added successfully", product: savedProduct})
    } catch (error) {
      res.status(500).json("Failed to add product.")
    }
})

app.post("/products/wishlist/:productId", async (req, res) => {
  try {
    const updatedProduct = await updatedIsWishlisted(req.params.productId, req.body)
    if(updatedProduct.length != 0) {
      res.status(201).json({message: "Product Updated Successfully.", product: updatedProduct})
    } else {
      res.status(404).json({message: "Product not found."})
    }
  } catch (error) {
    res.status(500).json({message: "Failed to update product."})
  }
})

app.post("/products/cart/:productId", async (req, res) => {
  try {
    const updatedProduct = await updatedInCart(req.params.productId, req.body)
    if(updatedProduct.length != 0) {
      res.status(201).json({message: "Product Updated Successfully.", product: updatedProduct})
    } else {
      res.status(404).json({message: "Product not found."})
    }
  } catch (error) {
    res.status(500).json({message: "Failed to update product."})
  }
})

app.post("/addresses", async (req, res) => {
    try {
        const newAddress = new Address(req.body)
        const savedAddress = await newAddress.save()
        res.status(201).json({message: "Address added successfully", address: savedAddress})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Adding address failed.", error: error})
    }
})

app.get("/addresses", async (req, res) => {
    try {
        const addresses = await Address.find()
            res.send(addresses)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "fetching addresses failed.", error: error})
    }
})

app.delete("/addresses/:id", async (req, res) => {
    try {
        const deletedAddress = await Address.findByIdAndDelete(req.params.id)

        if(!deletedAddress) {
            return res.status(404).json({error: "Address not found."})
        }

        res.status(200).json({
            message: "Address deleted successfully.",
            deletedAddress: deletedAddress
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal server error", error: error})
    }
})

async function getAllCategories() {
  try {
    const allCategories = await Category.find()
    return allCategories
  } catch (error) {
    console.log(error)
  }
}

async function getAllProducts() {
  try {
    const allProducts = await Product.find()
    return allProducts
  } catch (error) {
    console.log(error)
  }
}

async function addNewCategory(newCategory) {
  try {
    const category = new Category(newCategory)
    const savedCategory = await category.save()
    return savedCategory
  } catch (error) {
    console.log(error)
  }
}

async function addNewProduct(newProduct) {
  try {
    const product = new Product(newProduct)
    const savedProduct = await product.save()
    return savedProduct
  } catch (error) {
    console.log(error)
  }
}

async function findProductsByCategory(categoryName) {
  try {
    const products = await Product.find({category: categoryName})
    return products
  } catch (error) {
    console.log(error)
  }
}

async function findProductTypesByCategory(categoryName) {
  try {
    const productTypes = await Category.find({category: categoryName}, 'subCategory')
    return productTypes
  } catch (error) {
    console.log(error)
  }
}

async function updatedIsWishlisted(productId, updatedData) {
  try {
    const updatedProduct = Product.findByIdAndUpdate(productId, updatedData, {new: true})
    return updatedProduct
  } catch (error) {
    console.log(error)
  }
}

async function updatedInCart(productId, updatedData) {
  try {
    const updatedProduct = Product.findByIdAndUpdate(productId, updatedData, {new: true})
    return updatedProduct
  } catch (error) {
    console.log(error)
  }
}

async function getRequiredProduct(productId) {
  try {
    const requiredProduct = Product.findById(productId)
    return requiredProduct
  } catch (error) {
    console.log(error)
  }
}