require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/order.routes');

const app = express();

// Middleware
app.use(express.json());

app.use('/api/orders', orderRoutes);

// Connect to MongoDB
const PORT = process.env.PORT || 3000;

const startServer = async ()=>{
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
startServer();