import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // On encode les identifiants en Base64 pour le format Basic Auth
  const authToken = btoa('xhadee:xhadee');

  // On clone la requête pour y ajouter le header Authorization
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Basic ${authToken}`
    }
  });

  return next(authReq);
};
