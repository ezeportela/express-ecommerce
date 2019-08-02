const express = require('express'),
      ProductsService = require('../../services/products'),
      { productIdSchema, productTagSchema, createProductSchema, updateProductSchema } = require('../../utils/schemas/products'),
      validation = require('../../utils/middlewares/validation-handlers'),
      passport = require('passport')

const router = express.Router()

require('../../utils/auth/strategies/jwt')

const productsService = new ProductsService()

router.get('/', async (req, res, next) => {
    const { tags } = req.query

    try {
        const products = await productsService.getProducts({ tags })

        res.status(200).json({
            data: products,
            message: 'products listed'
        })
    } catch(err) {
        next(err)
    }
})

router.get('/:productId', async (req, res, next) => {
    const { productId } = req.params

    try {
        const product = await productsService.getProduct({ productId })

        res.status(200).json({
            data: product,
            message: 'product retrieved'
        })
    } catch(err) {
        next(err)
    }
})

router.post('/', validation(createProductSchema), async (req, res, next) => {
    const { body: product } = req

    console.log('create product', product)
    try {
        const createdProduct = await productsService.createProduct({ product })

        res.status(201).json({
            data: createdProduct,
            message: 'product created'
        })
    } catch(err) {
        next(err)
    }
})

router.put(
    '/:productId', 
    passport.authenticate('jwt', { session: false }),
    validation({ productId: productIdSchema }, 'params'), 
    validation(updateProductSchema), 
    async (req, res, next) => {
    const { productId } = req.params
    const { body: product } = req

    try {
        const updatedProduct = await productsService.updateProduct({ 
            productId,
            product
        })

        res.status(200).json({
            data: updatedProduct,
            message: 'product updated'
        })
    } catch(err) {
        next(err)
    }
})

router.delete(
    '/:productId', 
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
    const { productId } = req.params

    try {
        const deletedProduct = await productsService.deleteProduct({ productId })

        res.status(200).json({
            data: deletedProduct,
            message: 'product deleted'
        })
    } catch(err) {
        next(err)
    }
})

module.exports = router