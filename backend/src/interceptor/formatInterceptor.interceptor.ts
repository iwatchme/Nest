import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map } from 'rxjs';

export interface CustomResponse<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable()
export class FormatInterceptorInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CustomResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        code: context.switchToHttp().getResponse().statusCode,
        message: 'success', // 自定义成功消息
        data,
      })),
      catchError((error) => {
        console.log(error);
        if (error instanceof HttpException) {
          // 如果是HttpException，则直接抛出
          throw error;
        } else {
          // 如果不是HttpException，则抛出一个自定义的HttpException
          throw new HttpException(
            '自定义错误消息',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }),
    );
  }
}
