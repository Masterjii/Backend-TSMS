module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'changeme',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  // redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
};
