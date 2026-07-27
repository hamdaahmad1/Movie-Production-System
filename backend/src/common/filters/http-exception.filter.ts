import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
  } from '@nestjs/common';
  
  
  @Catch(HttpException)
  export class HttpExceptionFilter 
  implements ExceptionFilter {
  
  
    catch(
      exception: HttpException,
      host: ArgumentsHost,
    ) {
  
  
      const ctx = host.switchToHttp();
  
  
      const response = ctx.getResponse();
  
  
      const request = ctx.getRequest();
  
  
      const status = exception.getStatus();
  
  
      const exceptionResponse = exception.getResponse();
  
  
      let message = exception.message;
  
  
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
  
        const responseMessage =
          (exceptionResponse as any).message;
  
  
        if (responseMessage) {
  
          message = Array.isArray(responseMessage)
            ? responseMessage
            : responseMessage;
  
        }
  
      }
  
  
      response.status(status).json({
  
        success: false,
  
        message,
  
        statusCode: status,
  
        path: request.url,
  
        timestamp: new Date().toISOString(),
  
      });
  
    }
  
  }