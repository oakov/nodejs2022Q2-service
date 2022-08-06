import { Injectable, ConsoleLogger } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'fs';

export const LOG_LEVELS = {
  0: ['log'],
  1: ['log', 'error'],
  2: ['log', 'error', 'warn'],
  3: ['log', 'error', 'warn', 'debug'],
  4: ['log', 'error', 'warn', 'debug', 'verbose'],
};

const logger = (message, context, type, stack?) => {
  const dir = join(__dirname, '../../../logs/');
  if (!existsSync(dir)) mkdirSync(dir);
  const newLog =
    type === 'ERROR'
      ? `[${type}][${message}] - ${stack}\n`
      : `[${type}][${context}] - ${message}\n`;
  let logFile = join(
    dir,
    `/log-${LoggingService.lastLog}${type === 'ERROR' ? '-ERR' : ''}.txt`,
  );
  try {
    const { size } = statSync(logFile);
    if (size > 1024 * +process.env.LOGFILE_MAX_SIZE) {
      LoggingService.lastLog = Date.now();
      logFile = join(
        dir,
        `/log-${LoggingService.lastLog}${type === 'ERROR' ? '-ERR' : ''}.txt`,
      );
    }
    writeFileSync(logFile, newLog, { flag: 'as' });
  } catch {
    writeFileSync(logFile, newLog, { flag: 'as' });
  }
};

@Injectable()
export class LoggingService extends ConsoleLogger {
  constructor() {
    super();
    this.setLogLevels(LOG_LEVELS[process.env.LOG_LEVEL]);
  }
  static lastLog = Date.now();

  log(message: any, context) {
    logger(message, context, 'LOG');
    super.log(message, context);
  }
  error(message: any, stack?: string, context?: string) {
    logger(message, context, 'ERROR', stack);
    super.error(message, stack, context);
  }
  warn(message: any, context) {
    logger(message, context, 'WARNING');
    super.warn(message, context);
  }
  debug(message: any, context) {
    logger(message, context, 'DEBUG');
    super.debug(message, context);
  }
  verbose(message: any, context) {
    logger(message, context, 'VERBOSE');
    super.verbose(message, context);
  }
}
