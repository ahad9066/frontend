import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ModuleConfig } from './services/api.service';
import { Store } from '@ngxs/store';
import { SharedService } from '../shared/services/shared.service';
import { Logout } from './store/actions/auth.action';

@Injectable()
export class HttpReqResInterceptor implements HttpInterceptor {
    options: ModuleConfig;
    constructor(
        private router: Router,
        private store: Store,
        private sharedService: SharedService,
        options: ModuleConfig
    ) {
        this.options = options;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const access_token = window.sessionStorage.getItem('access_token');
        const refresh_token = window.sessionStorage.getItem('refresh_token');
        if (access_token != null) {
            request = request.clone({
                setHeaders: { Authorization: 'Bearer ' + access_token },
            });
        } else if (access_token === null && refresh_token !== null) {
            request = request.clone({
                setHeaders: { Authorization: 'Bearer ' + refresh_token },
            });
        }
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                console.log("interccc", error)
                if (error && error.status === 401) {
                    this.store.dispatch(new Logout());
                    this.sharedService.showErrors("You are unauthorised to access this. Please Login!");
                    this.router.navigateByUrl('/auth/login');
                } else if (error && error.status === 403) {
                    this.store.dispatch(new Logout());
                    this.sharedService.showErrors("You do not have permission to access this url");
                    this.router.navigateByUrl('/auth/login');
                }
                return throwError(error);
            })
        );
    }
}
