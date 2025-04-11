import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const message =
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse &&
        Array.isArray(exceptionResponse.message)
          ? Object.values(exceptionResponse.message).join(',\n')
          : exception.message;

      const responseBody = {
        success: false,
        result: {
          status: httpStatus,
          error: message,
        },
      };

      response.status(httpStatus).json(responseBody);
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      result: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal server Error',
      },
    });
  }
}
