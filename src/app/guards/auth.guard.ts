import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UtilisateurService } from '../services/utilisateur.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UtilisateurService);
  const router = inject(Router);

  // 1. VÉRIFICATION SYNCHRONE (Priorité Haute)
  // On regarde physiquement si le token existe. C'est instantané.
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('currentUser');

  if (token && userJson) {
    return true; // Accès accordé immédiatement
  }

  // 2. VÉRIFICATION ASYNCHRONE (Sécurité)
  // Si le storage est vide, on vérifie l'état du service une dernière fois
  return userService.user$.pipe(
    take(1), // Très important : on prend la valeur actuelle et on s'arrête
    map(user => {
      if (user) {
        return true;
      } else {
        // Redirection vers login avec l'URL de retour en mémoire
        return router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url }
        });
      }
    })
  );
};
