const logger = {
  info: (...args) => process.env.DEBUG && console.info(...args),
  warn: (...args) => process.env.DEBUG && console.warn(...args),
  error: (...args) => process.env.DEBUG && console.error(...args),
};

export default logger;
