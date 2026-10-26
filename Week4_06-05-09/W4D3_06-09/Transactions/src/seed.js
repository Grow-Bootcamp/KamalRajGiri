require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('./models/Product');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany({});

    const product = await Product.create({
      name: 'Mechanical Keyboard',
      price: 2500,
      stock: 10,
    });

    console.log('Product created:');
    console.log(product);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();