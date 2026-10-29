const mongoose = require('mongoose');

const productRepository = require('../repo/product.repo');
const orderRepository = require('../repo/order.repo');

const createOrder = async (productId, quantity) => {
    const session = await mongoose.startSession();

    try{
        session.startTransaction();

        // Check if the product exists and has enough stock
        const product = await productRepository.findById(productId,session);
        if(!product){
            throw new Error('Product not found');
        }

        // check stock
        if(product.stock < quantity){
            throw new Error('Insufficient stock');
        }

        // reduce stock
        const stockUpdate = await productRepository.decreaseStock(productId, quantity, session);

        if(stockUpdate.modifiedCount === 0){
            throw new Error('Failed to update stock');
        }

        // calculate totl
        const totalAmount = product.price * quantity;

        // create order
        const order = await orderRepository.create({
            product: product._id,
            quantity,
            totalAmount,
            status: 'Completed',
        }, session
        );

        // commit everything
        await session.commitTransaction();
        return order;
    } catch (error) {
        // rollback
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }

};

module.exports = {
    createOrder,
};