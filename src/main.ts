import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parse } from 'yaml';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { LoggingService } from './modules/logger/logger.service';
import { HttpExceptionFilter } from './modules/logger/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(LoggingService);
  app.useLogger(logger);
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalPipes(new ValidationPipe());

  const fileAPI = await readFile(
    join(process.cwd(), 'doc', 'api.yaml'),
    'utf-8',
  );
  const document = parse(fileAPI);

  SwaggerModule.setup('doc', app, document);

  await app.listen(process.env.PORT || 4000);
}

process.on('uncaughtExceptionMonitor', (error: Error) => {
  const logger = new LoggingService();
  logger.error(`Captured error: ${error.message}`, error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason: Error) => {
  const logger = new LoggingService();
  logger.error(
    `Unhandled Rejection at Promise: ${reason.message}`,
    reason.stack,
  );
  process.exit(1);
});

process.removeAllListeners('uncaughtException');
process.removeAllListeners('unhandledRejection');

bootstrap();
