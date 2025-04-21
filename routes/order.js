const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermissions,
} = require('../middleware/authenticateUser');

const {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    getTodayOrders,
    getClientAddress
} = require('../controllers/Order');

router
    .route('/')
    .post(authenticateUser, createOrder)
    .get(authenticateUser, authorizePermissions('admin'), getAllOrders);

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders);

router
    .route('/getTodayOrders')
    .get(authenticateUser, authorizePermissions('admin'),getTodayOrders)

router
    .route('/getClientAddress')
    .get(authenticateUser, authorizePermissions('admin'),getClientAddress)
    
router
    .route('/:id')
    .get(authenticateUser, getSingleOrder)
    .patch(authenticateUser, updateOrder)
    .delete(authenticateUser,deleteOrder)


module.exports = router;