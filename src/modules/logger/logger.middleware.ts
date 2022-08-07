import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, query, body } = request;

    response.on('finish', () => {
      const { statusCode } = response;

      this.logger.log(
        `Request: ${method} ${originalUrl} query parameters: ${JSON.stringify(
          query,
        )}, body: ${JSON.stringify(
          body,
        )}\n\t\tResponse: status code: ${statusCode}`,
      );
    });

    next();
  }
}
