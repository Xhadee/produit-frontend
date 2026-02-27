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
  isLoginMode = true;
  isLoading = false;
  errorMessage = '';

  credentials = {
    username: '',
    password: '',
    nom: '',
    email: ''
  };

  private router = inject(Router);
  private userService = inject(UtilisateurService);

  onToggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.credentials = { username: '', password: '', nom: '', email: '' };
  }

  onSubmit() {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = "Veuillez remplir tous les champs obligatoires.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isLoginMode) {
      // --- CONNEXION ---
      this.userService.login(this.credentials.username, this.credentials.password).subscribe({
        next: (user) => {
          console.log('Succès:', user.username);
          // Redirection vers produits (car c'est ta route par défaut dans app.routes)
          this.router.navigate(['/produits']);
        },
        error: (err) => {
          this.isLoading = false;
          // On récupère le message JSON du backend s'il existe
          this.errorMessage = err.error?.error || "Identifiants incorrects ou serveur indisponible.";
          console.error('Login error:', err);
        }
      });
    } else {
      // --- INSCRIPTION ---
      this.userService.register(this.credentials).subscribe({
        next: () => {
          this.isLoading = false;
          this.isLoginMode = true;
          this.errorMessage = "Compte créé ! Connectez-vous maintenant.";
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.error || "Erreur lors de l'inscription.";
        }
      });
    }
  }
}
