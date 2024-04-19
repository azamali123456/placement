import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ContextProvider } from '../providers/context.provider';
@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    ContextProvider.setAuthUser(context['args'][0]['user']);

    return next.handle();
  }
}
