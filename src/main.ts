import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parse } from 'yaml';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { LoggingService } from './modules/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(LoggingService));
  app.useGlobalPipes(new ValidationPipe());

  const fileAPI = await readFile(
    join(process.cwd(), 'doc', 'api.yaml'),
    'utf-8',
  );
  const document = parse(fileAPI);

  SwaggerModule.setup('doc', app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
