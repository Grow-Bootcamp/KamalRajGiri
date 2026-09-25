const EventEmitter = require('events');
const orderEvents = new EventEmitter();

function logOrder(order) {
    console.log(`LOG: Order #${order.id} was placed.`);
}

orderEvents.on('orderPlaced', logOrder);

function updateInventory(order) {
    console.log(`INVENTORY: Updating stock for order #${order.id}.`);
}

orderEvents.on('orderPlaced', updateInventory);

function sendNotification(order) {
    console.log(`NOTIFICATION: Sending confirmation for order #${order.id}.`);
}

orderEvents.on('orderPlaced', sendNotification);

function placeOrder(order) {
    console.log(`ORDER: Placing order #${order.id}`);

    orderEvents.emit('orderPlaced', order);
}


function recordAnalytics(order) {
    console.log(`ANALYTICS: Tracking order #${order.id}.`);
}
orderEvents.on('orderPlaced', recordAnalytics);

placeOrder({
    id: 103,
    amount: 120
});