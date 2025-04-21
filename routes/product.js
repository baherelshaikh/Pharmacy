const express = require('express')
const router = express.Router()
const { authenticateUser, authorizePermissions } = require('../middleware/authenticateUser')
const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImages,
} = require('../controllers/product')
// const {getSingleProductReviews} = require('../controllers/review')
const {upload} = require('../utils/multer.js')


router
  .route('/')
  .post([authenticateUser, authorizePermissions('admin')],createProduct)
  .get(getAllProducts)

router
  .route('/uploadImage')
  .post([authenticateUser, authorizePermissions('admin'), upload.array('images',3)], uploadImages)


router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
  .delete([authenticateUser, authorizePermissions('admin')], deleteProduct)

// router.route('/:id/reviews').get(getSingleProductReviews)


module.exports = router
