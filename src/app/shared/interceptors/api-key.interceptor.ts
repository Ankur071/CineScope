import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    if (req.url.includes('omdbapi.com')) {
        return next(req.clone({ setParams: { apikey: environment.omdbApiKey } }));
    }
    return next(req);
};
