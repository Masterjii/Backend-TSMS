require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/supportdb';

async function start(){
  try {
    await mongoose.connect(MONGO_URI, { autoIndex: true });
    logger.info('Connected to MongoDB');

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Startup error', err);
    process.exit(1);
  }
}


start();
