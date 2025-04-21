const Product = require('../models/Product')
const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const path = require('path')
const moment = require('moment')


const createProduct = async (req, res)=>{
    req.body.user = req.user.userId
    const product = await Product.create(req.body)
    const date = `Create a product at ${moment().format('hh:mm:ss A')}`
    await User.findOneAndUpdate({_id: req.user.userId}, {lastAction: date})
    res.status(StatusCodes.CREATED).json({ product })
}

const getAllProducts = async (req, res)=>{
    const products = await Product.find({})

    res.status(StatusCodes.OK).json({ products, count: products.length})
}

const getSingleProduct = async (req, res)=>{
    const {id: productId} = req.params

    const product = await Product.findOne({ _id: productId })//.populate('reviews')
    if(!product) throw new CustomError.NotFoundError(`No product with id: ${ productId }`)

    res.status(StatusCodes.OK).json({ product })
}

const updateProduct = async (req, res)=>{
    const {id: productId} = req.params

    const product = await Product.findOneAndUpdate({_id: productId}, req.body, {
        new: true,
        runValidators: true
    })
    if(!product) throw new CustomError.NotFoundError(`No product with id: ${ productId }`)

    res.status(StatusCodes.OK).json({product})
}

const deleteProduct = async (req, res)=>{
    const {id: productId} = req.params

    const product = await Product.findOneAndDelete({_id: productId})
    if(!product) throw new CustomError.NotFoundError(`No product with id: ${productId}`)

    const date = `Delete a product at ${moment().format('hh:mm:ss A')}`
    await User.findOneAndUpdate({_id: req.user.userId}, {lastAction: date})
    res.status(StatusCodes.OK).json({msg: 'success! product deleted'})
} 

const uploadImages = async (req, res)=>{
    if (!req.files || req.files.length === 0) 
        throw new CustomError.BadRequestError('No files uploaded')

    const productImages = req.files.map(file => path.join(__dirname,'../public/uploads/', file.originalname))

    res.status(StatusCodes.OK).send(productImages)
}

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImages,
}