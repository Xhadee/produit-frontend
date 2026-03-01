import { Component, Output, EventEmitter, HostListener, ElementRef, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UtilisateurService, Utilisateur } from '../../services/utilisateur.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();

  private eRef = inject(ElementRef);
  private router = inject(Router);
  private utilisateurService = inject(UtilisateurService);
  private notificationService = inject(NotificationService);

  // Données synchronisées
  currentUser: Utilisateur | null = null;
  notifications: Notification[] = [];

  // États de l'interface
  profileMenuOpen = false;
  notifMenuOpen = false;
  searchQuery: string = '';

  private userSub!: Subscription;
  private intervalId: any;

  ngOnInit(): void {
    /**
     * 1. SYNCHRONISATION RÉACTIVE
     * On s'abonne au flux utilisateur. Dès que le login réussit,
     * cet abonnement met à jour la Navbar instantanément.
     */
    this.userSub = this.utilisateurService.user$.subscribe({
      next: (user) => {
        this.currentUser = user;
        console.log('Navbar : Utilisateur synchronisé ->', user?.nom);
      }
    });

    /**
     * 2. CHARGEMENT INITIAL & REFRESH
     * Si l'utilisateur est déjà dans le service (via localStorage),
     * on n'appelle pas l'API. Sinon (cas d'un refresh F5), on récupère les infos.
     */
    if (!this.currentUser && localStorage.getItem('token')) {
      this.chargerProfil();
    }

    this.chargerNotifications();

    // 3. POLLING DES NOTIFICATIONS (30s)
    this.intervalId = setInterval(() => this.chargerNotifications(), 30000);
  }

  ngOnDestroy(): void {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.intervalId) clearInterval(this.intervalId);
  }

  // --- GESTION DES DONNÉES ---

  chargerProfil(): void {
    this.utilisateurService.getMe().subscribe({
      error: (err) => {
        console.error('Session expirée ou invalide:', err);
        this.deconnexion();
      }
    });
  }

  chargerNotifications(): void {
    this.notificationService.getNonLues().subscribe({
      next: (data) => this.notifications = data,
      error: (err) => console.error('Erreur notifications:', err)
    });
  }

  // --- ACTIONS ---

  marquerLue(id: number, event: Event): void {
    event.stopPropagation();
    this.notificationService.marquerCommeLue(id).subscribe(() => {
      this.notifications = this.notifications.filter(n => n.id !== id);
    });
  }

  toutMarquerLu(): void {
    this.notificationService.marquerToutCommeLu().subscribe(() => {
      this.notifications = [];
      this.notifMenuOpen = false;
    });
  }

  deconnexion(): void {
    // On ferme les menus avant de partir
    this.profileMenuOpen = false;
    this.notifMenuOpen = false;

    // Le service s'occupe de vider le localStorage et le userSubject
    this.utilisateurService.logout();

    // Redirection
    this.router.navigate(['/login']);
  }

  // --- LOGIQUE INTERFACE ---

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.profileMenuOpen = false;
      this.notifMenuOpen = false;
    }
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
    this.notifMenuOpen = false;
  }

  toggleNotifMenu(): void {
    this.notifMenuOpen = !this.notifMenuOpen;
    this.profileMenuOpen = false;
  }

  /**
   * Calcul dynamique des initiales
   * Gère les noms composés ou simples (ex: "Demba Ba" -> "DB")
   */
  get initiales(): string {
    if (!this.currentUser?.nom) return 'U';
    const parts = this.currentUser.nom.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  onSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return;

    if (query.startsWith('cat:')) {
      this.router.navigate(['/categories'], { queryParams: { q: query.replace('cat:', '').trim() } });
    } else if (query.startsWith('fou:')) {
      this.router.navigate(['/fournisseurs'], { queryParams: { q: query.replace('fou:', '').trim() } });
    } else {
      this.router.navigate(['/produits'], { queryParams: { q: query } });
    }

    this.searchQuery = '';
    this.notifMenuOpen = false;
    this.profileMenuOpen = false;
  }
}
