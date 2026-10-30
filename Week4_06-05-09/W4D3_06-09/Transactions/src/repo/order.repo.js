const Order = require('../models/Order');

const create = async (orderData, session) =>{
    const orders = await Order.create([orderData], { session });
    return orders[0];
};

module.exports = {
    create,
}
