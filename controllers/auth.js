const express = require('express')
const User = require('../models/User')
const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const { attachCookiesToResponse, jwtHandling } = require('../utils');



const register = async (req,res)=>{
    const {name, phone, password, image, address} = req.body
    if (!name || !phone || !password || !address) throw new CustomError.BadRequestError('Please provide All Credentials')

    const PhoneAlreadyExists = await User.findOne({phone})
    if(PhoneAlreadyExists) throw new CustomError.BadRequestError('phone is Already exist')

    const isTheFirst = (await User.countDocuments({})) === 0
    const role = isTheFirst ? 'admin' : 'user'

    const user = await User.create({name, phone, password, image, address, role})

    const readyuser = jwtHandling(user)
    const token = attachCookiesToResponse({res, user: readyuser}) // this var for testing cookies

    res.status(StatusCodes.CREATED).json({user: readyuser, Token: token});
}

const login = async (req, res)=>{
    const {phone, password} = req.body
    if (!phone || !password) throw new CustomError.BadRequestError('Please provide an email and password')

    const user = await User.findOne({ phone })
    if (!user) throw new CustomError.UnauthenticatedError('Invalid phone')

    const comparePassword = await user.comparePassword(password)
    if (!comparePassword) throw new CustomError.UnauthenticatedError('Invalid password')

    const readyuser = jwtHandling(user)
    const token = attachCookiesToResponse({res, user: readyuser})

    res.status(StatusCodes.OK).json({user: readyuser, Token: token})
}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    });
    
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};
module.exports = {register, login, logout}