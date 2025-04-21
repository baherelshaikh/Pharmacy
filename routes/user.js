const express = require('express')
const router = express.Router()
const { getAllUsers,
        getSingleUser,
        showCurrentUser,
        updateUser, 
        updateUserPassword, 
        deleteUserAccount,
        userUploadImage } = require('../controllers/User')
const { authenticateUser, authorizePermissions } = require('../middleware/authenticateUser')
const {userUpload} = require('../utils/multer.js')


router.route('/').get(authenticateUser, authorizePermissions('admin'), getAllUsers)
router.route('/:id').get(authenticateUser,getSingleUser)
router.route('/showMe').get(authenticateUser, showCurrentUser)
router.route('/updateUser').patch(authenticateUser, updateUser)
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)
router.route('/deleteUserAccount').delete(authenticateUser, deleteUserAccount)
router.route('/useruploadImage').post(userUpload.single('image'), userUploadImage)

module.exports = router