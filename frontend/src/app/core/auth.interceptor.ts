import { HttpInterceptorFn } from '@angular/common/http';

// Añade el token JWT (guardado en localStorage) a cada petición saliente.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('ufps_token');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
