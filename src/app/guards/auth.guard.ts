import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  if(inject(AuthService).authenticated()) {
    if(isTokenExpired()) {
      inject(AuthService).logout();
      inject(Router).navigate(['/login']);
      return false;
    }
    if(!inject(AuthService).isAdmin()) {
      inject(Router).navigate(['/forbidden']);
      return false;
    }
    return true;
  }
  inject(Router).navigate(['/login']);
  return false;
};

const isTokenExpired = () => {
  const token = inject(AuthService).token;
  const payload = inject(AuthService).getPayload(token);
  const exp = payload.exp; //fecha de expiración del token
  const now = new Date().getTime() / 1000; //fecha actual en segundos

  if (now > exp) {
    return true;
  }
  return false;
}
