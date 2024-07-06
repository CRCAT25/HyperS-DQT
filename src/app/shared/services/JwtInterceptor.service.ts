import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class JwtInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');
        if(token && req.url !== 'https://api.imgbb.com/1/upload'){
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            })
        }
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if(error.status == 401){
                    localStorage.removeItem('token')
                }
                return throwError(error);
            })
        )
    }

}