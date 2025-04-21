const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User')
const moment = require('moment');
const path = require('path')
const PDFDocument = require("../utils/pdfKit-tables");



const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');


const fakeStripeAPI = async ({ amount, currency }) => {
    const client_secret = 'someRandomValue';
    return { client_secret, amount };
};

const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body;

    if (!cartItems || cartItems.length < 1) {
        throw new CustomError.BadRequestError('No cart items provided');
    }
    if (!tax || !shippingFee) {
        throw new CustomError.BadRequestError(
        'Please provide tax and shipping fee'
        );
    }

    let orderItems = [];
    let subtotal = 0;

    for (const item of cartItems) {
        const dbProduct = await Product.findOne({ _id: item.product });
        if (!dbProduct) throw new CustomError.NotFoundError(`No product with id : ${item.product}`);
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
        amount: item.amount,
        name,
        price,
        image:image[0],
        product: _id,
    };

    orderItems = [...orderItems, singleOrderItem];

    subtotal += item.amount * price;
    }

    const total = tax + shippingFee + subtotal;

    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd',
    });

    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId,
    });

    res.status(StatusCodes.CREATED).json({ order, clientSecret: order.clientSecret });
}

const getAllOrders = async (req, res) => {
    const orders = await Order.find({}).sort({createdAt: -1});
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
}

const getSingleOrder = async (req, res) => {
    const { id: orderId } = req.params;

    const order = await Order.findOne({ _id: orderId });
    if (!order) throw new CustomError.NotFoundError(`No order with id : ${orderId}`);

    checkPermissions(req.user, order.user);
    res.status(StatusCodes.OK).json({ order });
}

const deleteOrder = async (req, res)=>{
    const {id: orderId} = req.params

    const product = await Order.findOneAndDelete({_id: orderId})
    if(!product) throw new CustomError.NotFoundError(`No product with id: ${id}`)
    
    const date = `Delete an order at ${moment().format('hh:mm:ss A')}`
    await User.findOneAndUpdate({_id: req.user.userId}, {lastAction: date})
    res.status(StatusCodes.OK).json({msg: 'success! order deleted'})
} 

const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
}

const updateOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findOne({ _id: orderId });
    if (!order) throw new CustomError.NotFoundError(`No order with id : ${orderId}`)
    
    checkPermissions(req.user, order.user);

    // order.paymentIntentId = paymentIntentId;
    order.status = status;
    await order.save();

    const date = `Update an order's status at ${moment().format('hh:mm:ss A')}`
    await User.findOneAndUpdate({_id: req.user.userId}, {lastAction: date})
    res.status(StatusCodes.OK).json({ order });
};

const getTodayOrders = async (req, res) => {
    try {
      // Get the start and end of today
      const startOfDay = moment().startOf('day').toDate();
      const endOfDay = moment().endOf('day').toDate();
  
      // Fetch today's orders from the database
      const todaysOrders = await Order.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
    const doc = new PDFDocument();
        // Create The PDF document
    
        // Pipe the PDF into a patient file
        doc.pipe(res);
    
        // Add the header - https://pspdfkit.com/blog/2019/generate-invoices-pdfkit-node/
        const pathI = path.join(__dirname,"../public/uploads/Logo.png")
        doc
            .image(pathI, 20, 40, { width: 100 })
            .moveDown(1)
            .fillColor("#444444")
            .fontSize(10)
            .text(`Date: ${moment().format('YYYY-MM-DD')} .`, { y:40, align: "right" })
            .text(`Time: ${moment().format('hh:mm:ss A')}`, { y: doc.y, align: "right" })
            // .text(` `, 200, 65, { align: "center" })
            .moveDown(2)
            .fontSize(20)
            .text("Today's Orders Report",{y: doc.y, align: "center" })
            // .text(`Date: ${moment().format('YYYY-MM-DD')}`, 200, 80, { align: "right" })
            .moveDown(1);
    

        // doc
        //     .fontSize(14)
        //     .font('Helvetica')
        //     .text(`Date: ${moment().format('YYYY-MM-DD')}`, { align: 'center' })
        //     .moveDown();

        // Create the table - https://www.andronio.me/2017/09/02/pdfkit-tables/
        const table = {
            headers: ["ID", "Status", "Total"],
            rows: []
                // [] //patient.birthday, patient.emailAddress, patient.bloodType, patient.height, patient.weight]
            
        };

        const pTable = {
            headers: ["Name", "Amount","Price"],
            rows: []
                // [] //patient.birthday, patient.emailAddress, patient.bloodType, patient.height, patient.weight]
            
        };

        let orderedItems = []
        let subtotals = 0;
        let totals = 0 ;
        for (const order of todaysOrders) {
            subtotals += order.subtotal
            totals += order.total
            console.log(order.subtotal)
            for(const item of order.orderItems){
                let nItem = {name: item.name, amount: item.amount, pPrice:item.price,}
                    nItem['price'] = nItem.pPrice*nItem.amount
                const oItem = orderedItems.filter(item => item.name === nItem.name)
                if(oItem[0]){
                    // console.log(nItem.amount[0])
                    nItem.amount += oItem[0].amount;
                    nItem.price = nItem.pPrice * nItem.amount
                    const nOrderedItems = orderedItems.filter(item => item.name !== nItem.name)
                    orderedItems = [...nOrderedItems,nItem]
                }else{
                    orderedItems = [...orderedItems,nItem]
                }
            }
            // const orderDate = moment(order.createdAt).format('YYYY-MM-DD');
            table.rows.push([order._id, order.status, `$${(order.total).toFixed(2)}`])
        }
        for(const item of orderedItems){
            pTable.rows.push([item.name, item.amount, `$${item.price}`])
        }
        // doc.fontSize(18)
        // pTable.rows.push(["Total", " ", subtotals.toFixed(2)])
        // doc.text("")
        // Draw the table
        doc.font("Courier-Bold")
        doc.fontSize(15)
        doc.text('Orders:',  42, doc.y,{ align: "left" });
        // doc.moveDown(1);
        doc.moveDown().table(table, 42, doc.y, { width: 525 });
        doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Total', 50, doc.y, { width: 100 })
        .text(`$${totals.toFixed(2)}`, 390, doc.y-15, { width: 100 });

        doc.moveDown(3)
        doc.fontSize(15)
        doc.text('Sold products:', 42, doc.y+3,{ align: "left" });
        doc.moveDown().table(pTable, 42, doc.y, { width: 525 });
        doc.moveDown(); // Optional move down for extra space

        // Table footer (example: total sum)
// const totalSum = orders.reduce((sum, order) => sum + order.total, 0);
const footerY = 100 + (3 + 1) * 20; // Position the footer below the last row

doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('Sub Total', 50, doc.y-10, { width: 100 })
    .text(`$${subtotals.toFixed(2)}`, 390, doc.y-15, { width: 100 });

        doc.moveDown(2); // Move down 2 lines or however much space you need
        doc.end();
        
    
    } catch (error) {
      console.error('Error creating PDF:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

};

const getClientAddress = async (req, res) => {
    try {
      // Get the start and end of today
      const startOfDay = moment().startOf('day').toDate();
      const endOfDay = moment().endOf('day').toDate();
  
      // Fetch today's orders from the database
      const todaysOrders = await Order.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
    const doc = new PDFDocument();
        // Create The PDF document
    
        // Pipe the PDF into a patient file
        doc.pipe(res);
    
        // Add the header - https://pspdfkit.com/blog/2019/generate-invoices-pdfkit-node/
        const pathI = path.join(__dirname,"../public/uploads/Logo.png")
        doc
            .image(pathI, 20, 40, { width: 100 })
            .moveDown(1)
            .fillColor("#444444")
            .fontSize(10)
            .text(`Date: ${moment().format('YYYY-MM-DD')} .`, { y:40, align: "right" })
            .text(`Time: ${moment().format('hh:mm:ss A')}`, { y: doc.y, align: "right" })
            // .text(` `, 200, 65, { align: "center" })
            .moveDown(2)
            .fontSize(20)
            .text("Clients' Addresses",{y: doc.y, align: "center" })
            // .text(`Date: ${moment().format('YYYY-MM-DD')}`, 200, 80, { align: "right" })
            .moveDown(1);
    

        // doc
        //     .fontSize(14)
        //     .font('Helvetica')
        //     .text(`Date: ${moment().format('YYYY-MM-DD')}`, { align: 'center' })
        //     .moveDown();

        // Create the table - https://www.andronio.me/2017/09/02/pdfkit-tables/
        const table = {
            headers: ["Order's ID", "Address"],
            rows: []
                // [] //patient.birthday, patient.emailAddress, patient.bloodType, patient.height, patient.weight]
            
        };

        for (const order of todaysOrders) {
            table.rows.push([order._id, order.address])
        }
        // doc.fontSize(18)
        // pTable.rows.push(["Total", " ", subtotals.toFixed(2)])
        // doc.text("")
        // Draw the table
        doc.font("Courier-Bold")
        doc.fontSize(15)
        doc.text('Adresses:',  42, doc.y,{ align: "left" });
        doc.moveDown().table(table, 42, doc.y, { width: 525 });

        doc.end();

        // Table footer (example: total sum)
// const totalSum = orders.reduce((sum, order) => sum + order.total, 0);        
    
    } catch (error) {
        console.error('Error creating PDF:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

};
module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    getTodayOrders,
    getClientAddress
};