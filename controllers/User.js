const User = require('../models/User')
const CustomError = require('../errors')
const path = require('path')
const {checkPermissions, jwtHandling, attachCookiesToResponse} = require('../utils')
const { StatusCodes } = require('http-status-codes')



const getAllUsers = async (req,res)=>{
    const users = await User.find({role: 'user'}).select('-password')
    res.status(StatusCodes.OK).json({ users })
}

const getSingleUser = async (req, res)=>{
    const user = await User.findOne({_id: req.params.id}).select('-password')
    if (!user) throw new CustomError.NotFoundError(`NO user with id: ${req.params.id}`)

    checkPermissions(req.user, user._id) // you can get the user just in two cases --> (you are the admin) or (that user is you).
    res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user });
}

const updateUser = async (req,res)=>{
    const {name, email} = req.body
    if (!name || !email) throw new CustomError.BadRequestError('Please provide email and password ')

    const user = await User.findOne({_id: req.user.userId})
    if(!user) throw new CustomError.NotFoundError(`No user with Id: ${req.user.userId}`)

    user.name = name 
    user.email = email
    await user.save()

    const readyuser = jwtHandling(user)
    attachCookiesToResponse({res, user: readyuser})

    res.status(StatusCodes.OK).json({user: readyuser})
}

const updateUserPassword = async (req, res)=>{
    const {oldPassword, newPassword} = req.body
    if(!oldPassword || !newPassword) throw new CustomError.BadRequestError('Please provide the passwords')

    const user = await User.findOne({_id: req.user.userId})
    const isMatch = await user.comparePassword(oldPassword)
    if(!isMatch) throw new CustomError.UnauthenticatedError('Invalid Credentials')

    user.password = newPassword
    await user.save()

    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.'})
}

const deleteUserAccount = async (req,res)=>{
    const {password} = req.body
    if (!password) throw new CustomError.BadRequestError('Please provide the password')

    const user = await User.findOne({_id: req.user.userId})
    const isMatch = await user.comparePassword(password)
    if(!isMatch) throw new CustomError.UnauthenticatedError('Invalid Credentials')

    await User.remove()
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    });

    res.status(StatusCodes.OK).json({ msg: 'succes! Account Deleted'})
}

const userUploadImage = async (req, res)=>{
    if (!req.file ) //|| req.files.length === 0
        throw new CustomError.BadRequestError('No files uploaded')

    const userImage = path.join(__dirname,'../public/uploads/usersImages', req.file.originalname)
    res.status(StatusCodes.OK).json(userImage)
}
module.exports = { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword, deleteUserAccount, userUploadImage}