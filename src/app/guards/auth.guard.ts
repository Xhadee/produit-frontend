import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UtilisateurService } from '../services/utilisateur.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UtilisateurService);
  const router = inject(Router);

  return userService.isLoggedIn().pipe(
    map(isAuth => {
      if (isAuth) return true;
      router.navigate(['/login']); // Redirection si non connecté
      return false;
    })
  );
};
