import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ClassConstructor, plainToClass } from 'class-transformer';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<any, T> {
  constructor(private readonly classType: ClassConstructor<T>) {}

  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((item) => this.transformResponse(item));
        } else {
          return this.transformResponse(data);
        }
      }),
    );
  }

  private transformResponse(data: any): T {
    return plainToClass<T, any>(this.classType, data, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
