const orderService = require('../services/order.services');

const createOrder = async (req, res) => {
    try{
        const {productId,quantity} = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and quantity are required' });
        }
        const order = await orderService.createOrder(productId, quantity);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create order',
        });
    }
};

module.exports = {
    createOrder,
};