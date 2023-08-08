import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {Observable} from 'rxjs';
import {AuthService} from '../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken: string | null = AuthService.getAuthorizationToken();
    let authReq = req.clone();
    if (authToken) {
      authReq = req.clone({setHeaders: {Authorization: authToken}});
    }

    return next.handle(authReq);
  }
}
