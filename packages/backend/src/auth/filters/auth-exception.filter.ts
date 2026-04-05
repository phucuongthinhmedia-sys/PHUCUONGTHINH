import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException, ForbiddenException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const errorResponse = {
      error: {
        code: exception.constructor.name.replace('Exception', '').toUpperCase(),
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
      },
    };

    response.status(status).json(errorResponse);
  }
}
