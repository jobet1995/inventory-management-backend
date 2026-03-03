type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const formatMessage = (level: LogLevel, message: string, meta?: any) => {
  const timestamp = new Date().toISOString();
  // Strip out sensitive properties if needed before logging
  const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
};

export const logger = {
  info: (message: string, meta?: any) => console.log(formatMessage('info', message, meta)),
  warn: (message: string, meta?: any) => console.warn(formatMessage('warn', message, meta)),
  error: (message: string, meta?: any) => console.error(formatMessage('error', message, meta)),
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatMessage('debug', message, meta));
    }
  },
};

export default logger;
