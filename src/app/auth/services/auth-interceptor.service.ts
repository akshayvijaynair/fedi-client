import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(
      Preferences.get({
        key: 'token',
      })
    ).pipe(
      switchMap((data) => {
        const token = data?.value;
        let headers = req.headers
          .set('Content-Type', 'application/ld+json')
          .set('Accept', 'application/ld+json'); // Set JSON-LD headers globally

        if (token) {
          headers = headers.set('Authorization', 'Bearer ' + token); // Add Authorization if token exists
        }

        // Clone the request with updated headers
        const clonedRequest = req.clone({ headers });

        return next.handle(clonedRequest);
      })
    );
  }

  constructor() {}
}
