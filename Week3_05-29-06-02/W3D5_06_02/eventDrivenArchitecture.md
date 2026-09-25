# Event and Event Driven Architecture
Node provides `EventEmitter` through the builtin `events` module.
The main class is `EventEmitter`

EventEmitter
     │
     ├── emit()
     │
     ├── on()
     │
     ├── once()
     │
     └── off()

# emitter.on()
Registers a listener that can run every time the event occurs.
`emitter.on('orderPlaced', handler);`
Whenever orderplaced happens, run this

# .once()
Register a listener that runs only once.
`emitter.once('orderPlaced', handler);`

# .emit()
Actually fires the event.
`emitter.emit('orderPlaced',order);`
The event has happened.

# .off()
Removes a previously registered listner.
`emitter.off('orderPlaced', handler);`
Stop this handler from listening.


