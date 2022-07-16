import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parse } from 'yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const config = new DocumentBuilder()
  //   .setTitle('Home Library Service')
  //   .setDescription('Home music library service')
  //   .setVersion('1.0.0')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);

  const fileAPI = await readFile(
    join(process.cwd(), 'doc', 'api.yaml'),
    'utf-8',
  );
  const document = parse(fileAPI);

  SwaggerModule.setup('doc', app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
