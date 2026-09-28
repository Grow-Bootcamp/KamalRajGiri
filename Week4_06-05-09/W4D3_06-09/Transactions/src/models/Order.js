const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
    {
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity:{
            type: Number,
            required: true,
            min: 1
        },
        totalAmount:{
            type: Number,
            required: true,
            min: 0
        },
        status:{
            type: String,
            enum: ['Pending', 'Completed', 'Cancelled'],
            default: 'Pending'
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Order', orderSchema);