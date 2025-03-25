import { HttpInterceptorFn, HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // Get the auth token from localStorage
  const authToken = localStorage.getItem('authToken');
  
  // Clone the request and add the authorization header if token exists
  const authReq = authToken 
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      })
    : req;
  
  // Pass on the cloned request instead of the original request
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle different error scenarios
      if (error.status === 401) {
        // Handle 401 Unauthorized - could redirect to login
        console.error('Unauthorized access');
        // Could navigate to login page or show modal
      } else if (error.status === 403) {
        // Handle 403 Forbidden
        console.error('Forbidden resource');
      } else if (error.status === 404) {
        // Handle 404 Not Found
        console.error('Resource not found');
      } else if (error.status === 500) {
        // Handle 500 Internal Server Error
        console.error('Server error');
      }
      
      return throwError(() => error);
    })
  );
}; 