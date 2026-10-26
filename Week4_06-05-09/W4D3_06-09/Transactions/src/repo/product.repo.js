const Product = require('../models/Product');

const findById = async (productId, session) => {
    return Product.findById(productId).session(session);
};

const decreaseStock = async (productId, quantity, session) => {
    return Product.updateOne(
        {
            _id: productId,
            stock: { $gte: quantity },
        },
        {
            $inc: { stock: -quantity },
        },
        {
            session,
        }
    );
};

module.exports = {
    findById,
    decreaseStock,

}