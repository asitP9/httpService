import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType } from '@angular/common/http';
import {tap} from 'rxjs/operators';

export class AuthInterceptorService implements HttpInterceptor{
    intercept(req:HttpRequest<any>,next:HttpHandler){
        
        const modifiedUrl=req.clone({
                headers:req.headers.append('auth','xyz')
        })
        return next.handle(modifiedUrl);
}
}