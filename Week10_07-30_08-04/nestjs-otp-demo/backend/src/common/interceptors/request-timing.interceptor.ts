
import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';

import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestTimingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const startedAt = Date.now();

    const request = context.switchToHttp().getRequest();

    const { method, originalUrl } = request;

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startedAt;

          console.log(
            `[INTERCEPTOR] ${method} ${originalUrl} completed in ${duration}ms`,
          );
        },
      }),
    );
  }
}
