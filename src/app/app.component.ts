import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

// Import de tes composants
import { NavbarComponent } from './components/navbar/navbar.component';
import { WelcomeScreenComponent } from './components/welcome-screen/welcome-screen.component';
import { SidebarComponent } from "./components/sidebar/sidebar.component";

// Import de tes services
import { ThemeService } from './services/theme.service';
import { UtilisateurService } from './services/utilisateur.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    WelcomeScreenComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // --- Injections ---
  private themeService = inject(ThemeService);
  private userService = inject(UtilisateurService);
  private router = inject(Router);

  // --- Propriétés d'état ---
  isCollapsed = false;
  isDarkMode = this.themeService.isDarkMode;
  currentUrl = '';

  // isLoading contrôle l'affichage du WelcomeScreenComponent
  isLoading = false;

  ngOnInit(): void {
    // 1. Écoute permanente des changements de route pour adapter l'interface
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.urlAfterRedirects;
      console.log('Navigation terminée vers :', this.currentUrl);
    });

    // 2. Abonnement à l'état de transition (Welcome Screen) déclenché par le Login
    this.userService.isWelcoming$.subscribe(state => {
      console.log('État du Welcome Screen :', state);
      this.isLoading = state;
    });

    // 3. Sécurité au démarrage : on s'assure que l'app n'est pas bloquée en chargement
    // (Utile si on rafraîchit la page pendant une transition)
    this.isLoading = false;
  }

  /**
   * Détermine si la Sidebar et la Navbar doivent être affichées.
   * On cache l'interface sur la page de login, la racine, ou pendant le Welcome Screen.
   */
  showInterface(): boolean {
    // Si l'écran de bienvenue est actif, on ne montre pas la structure du dashboard
    if (this.isLoading) return false;

    // Liste des routes où l'interface (Sidebar/Navbar) est masquée
    const authRoutes = ['/login', '/', ''];
    const isAuthPage = authRoutes.some(route => this.currentUrl === route || this.currentUrl.includes('/login'));

    return !isAuthPage;
  }

  /**
   * Alterne l'état réduit/étendu de la sidebar
   */
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
