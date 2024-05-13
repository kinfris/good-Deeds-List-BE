import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status === 400) {
      const errorResponse = {
        errors: [],
      };

      const responseBody: any = exception.getResponse();
      console.log(responseBody);
      responseBody.message.forEach((e) => errorResponse.errors.push(e));
      response.status(status).json(errorResponse);
    } else {
      response.status(status).json({
        statusCode: status,
        message: exception.getResponse(),
      });
    }
  }
}
