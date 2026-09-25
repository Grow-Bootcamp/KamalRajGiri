const EventEmitter = require('events');

const orderEvents = new EventEmitter();

// orderEvents.on('orderPlaced', (order) => {
//     console.log(`New order received: #${order.id} for $${order.amount}`);
// });

// orderEvents.once('orderPlaced', () => {
//     console.log('This runs only for the first order.');
// });

// orderEvents.emit('orderPlaced', {
//     id: 101,
//     amount: 49.99
// });

// orderEvents.emit('orderPlaced', {
//     id: 102,
//     amount: 75.50
// });


function orderLogger(order){
    console.log(`New order received: #${order.id} for $${order.amount}`);
}

orderEvents.on('orderPlaced', orderLogger);
orderEvents.emit('orderPlaced', {
    id: 101,
    amount: 49.99
});

orderEvents.off('orderPlaced', orderLogger);

orderEvents.emit('orderPlaced', {
    id: 102,
    amount: 75.50
});