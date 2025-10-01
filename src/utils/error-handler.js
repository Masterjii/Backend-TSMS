const logger = require('./logger');

module.exports = (err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};
