export default {
  ...(process.env.NODE_ENV === 'development' ? { simulateNoJs: false } : {}),
};
