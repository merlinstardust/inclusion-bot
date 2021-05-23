const logger = {
  info: (...args) => {
    if (process.env.DEBUG) {
      console.info('INFO');
      console.info(...args);
      console.log('INFO END\n');
    }
  },
  warn: (...args) => {
    if (process.env.DEBUG) {
      console.warn('WARN');
      console.warn(...args);
      console.log('WARN END\n');
    }
  },
  error: (...args) => {
    if (process.env.DEBUG) {
      console.error('ERROR');
      console.error(...args);
      console.log('ERROR END\n');
    }
  },
};

export default logger;
