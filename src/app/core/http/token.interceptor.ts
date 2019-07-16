import { Injectable, ErrorHandler } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '@env/environment';

const credentialsKey = environment.credentialsKey;
// console.log(credentialsKey);
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    let token: string = null;
    if (savedCredentials) {
      const credentials = JSON.parse(savedCredentials);
      console.log(credentials);
      token = credentials['token'].accessToken;
    }

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      tap((evt: any) => {
        return evt;
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          try {
            if (
              err.error.detail === 'Invalid token.' ||
              err.error.detail === 'Authentication credentials were not provided.'
            ) {
              sessionStorage.removeItem(credentialsKey);
              localStorage.removeItem(credentialsKey);
              this.router.navigate(['login']);
            }
          } catch (e) {
            console.log(err);
          }
          //log error
        }
        return throwError(err);
      })
    );
  }
}
