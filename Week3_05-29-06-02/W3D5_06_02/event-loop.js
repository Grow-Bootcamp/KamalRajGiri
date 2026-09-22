console.log('1: sync');

setTimeout(() => {
    console.log('2: setTimeout');
}, 0);

setImmediate(() => {
    console.log('3: setImmediate');
});

Promise.resolve().then(() => {
    console.log('4: promise microtask');
});

process.nextTick(() => {
    console.log('5: nextTick');
});

console.log('6: sync');