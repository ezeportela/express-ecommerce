const express = require('express'),
      ProductsService = require('../../services/products')

const router = express.Router()

const productService = new ProductsService()

router.get("/", async (req, res, next) => {
  const { tags } = req.query;

  try {
    const products = await productService.getProducts({ tags })
    res.render("products", { products })
  } catch (err) {
    next(err)
  }
})

module.exports = router;