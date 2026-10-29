import 'dotenv/config';

import app from './app.js';

import { connectToDatabase } from './config/db.js';

const PORT = process.env.PORT || 3000;

const startServer = async () : Promise<void> => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
    } catch (error) {
        console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();