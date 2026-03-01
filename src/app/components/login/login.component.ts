import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilisateurService } from '../../services/utilisateur.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Propriétés d'état
  isLoginMode = true;
  isLoading = false; // Spinner du bouton
  errorMessage = '';

  credentials = {
    username: '',
    password: '',
    nom: '',
    email: ''
  };

  // Injections
  private router = inject(Router);
  private userService = inject(UtilisateurService);

  onToggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.credentials = { username: '', password: '', nom: '', email: '' };
  }

  onSubmit() {
    // LOG DE DÉPART : Si tu ne vois pas ça, le bouton HTML ne déclenche rien
    console.log('--- Tentative de soumission ---');
    console.log('Mode:', this.isLoginMode ? 'Login' : 'Register');

    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = "Veuillez remplir tous les champs obligatoires.";
      console.warn('Formulaire incomplet');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isLoginMode) {
      this.userService.login(this.credentials.username, this.credentials.password).subscribe({
        next: (res) => {
          // 1. On lance l'écran de bienvenue immédiatement
          this.userService.setWelcoming(true);
          this.isLoading = false;

          // 2. PETITE ASTUCE : On attend 100ms
          // Cela laisse le temps au service de finir d'écrire dans le localStorage
          // et au Guard de voir que l'utilisateur est bien connecté.
          setTimeout(() => {
            this.router.navigate(['/dashboard']).then((navigated) => {
              console.log('Navigation vers dashboard réussie ?', navigated);

              if (navigated) {
                // 3. On attend les 2 secondes de l'animation avant de retirer le rideau
                setTimeout(() => {
                  this.userService.setWelcoming(false);
                }, 2000);
              } else {
                // Sécurité : Si le Guard bloque encore, on ne reste pas coincé sur le Welcome Screen
                this.userService.setWelcoming(false);
                this.errorMessage = "Erreur de redirection. Veuillez réessayer.";
              }
            });
          }, 100);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || "Identifiants incorrects.";
        }
      });
    } else {
      // --- PHASE D'INSCRIPTION ---
      console.log('Appel service register...');

      this.userService.register(this.credentials).subscribe({
        next: () => {
          console.log('Inscription réussie');
          this.isLoading = false;
          this.isLoginMode = true;
          this.errorMessage = "Compte créé avec succès ! Connectez-vous.";
          this.credentials.password = '';
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erreur API Register:', err);
          this.errorMessage = err.error?.message || "Erreur lors de l'inscription.";
        }
      });
    }
  }
}
