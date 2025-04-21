const multer = require('multer')
path = require('path')
CustomError = require('../errors')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../public/uploads/')); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); 
    }
})

const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../public/uploads/usersImages')); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); 
    },
})

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
        return cb(new CustomError.BadRequestError('Please upload images'), false)
    }
    const maxSize = 1024 * 1024 // 1MB
    if (!file.size > maxSize) {
        return cb(new CustomError.BadRequestError('The image must be smaller than 1MB'), false)
    }
    cb(null, true)
}


const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
})

const userUpload = multer({ 
    storage: userStorage,
    fileFilter: fileFilter
})

module.exports = {upload, userUpload}