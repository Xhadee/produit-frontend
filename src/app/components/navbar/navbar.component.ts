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

  currentUser: Utilisateur | null = null;
  notifications: Notification[] = [];

  profileMenuOpen = false;
  notifMenuOpen = false;
  searchQuery: string = '';

  // Pour stocker l'abonnement et le couper proprement à la destruction du composant
  private userSub!: Subscription;
  private intervalId: any;

  ngOnInit(): void {
    // SYNCHRONISATION EN TEMPS RÉEL :
    // On s'abonne au BehaviorSubject du service.
    // Dès que updateProfil() est appelé ailleurs, ce bloc s'exécute.
    this.userSub = this.utilisateurService.user$.subscribe({
      next: (user) => {
        this.currentUser = user;
      }
    });

    // Chargement initial (si le Subject est vide)
    this.chargerProfil();
    this.chargerNotifications();

    // Polling des notifications
    this.intervalId = setInterval(() => this.chargerNotifications(), 30000);
  }

  ngOnDestroy(): void {
    // Nettoyage pour éviter les fuites de mémoire
    if (this.userSub) this.userSub.unsubscribe();
    if (this.intervalId) clearInterval(this.intervalId);
  }

  // --- LOGIQUE API ---

  chargerProfil(): void {
    // getMe() dans ton service fait maintenant un .next() sur le userSubject
    this.utilisateurService.getMe().subscribe({
      error: (err) => console.error('Erreur profil:', err)
    });
  }

  chargerNotifications(): void {
    this.notificationService.getNonLues().subscribe({
      next: (data) => this.notifications = data,
      error: (err) => console.error('Erreur notifications:', err)
    });
  }

  // --- ACTIONS NOTIFICATIONS ---

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

  // Calcul dynamique des initiales (ex: "Xhadee Admin" -> "XA")
  get initiales(): string {
    if (!this.currentUser?.nom) return '??';
    const parts = this.currentUser.nom.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  // --- RECHERCHE & DÉCONNEXION ---

  onSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return;

    const routes: { [key: string]: string } = { 'cat:': '/categories', 'fou:': '/fournisseurs' };
    const prefix = Object.keys(routes).find(p => query.startsWith(p));

    if (prefix) {
      this.router.navigate([routes[prefix]], { queryParams: { q: query.replace(prefix, '').trim() } });
    } else {
      this.router.navigate(['/produits'], { queryParams: { q: query } });
    }
    this.searchQuery = '';
  }

  deconnexion(): void {
    if (confirm("Souhaitez-vous fermer votre session sécurisée ?")) {
      this.utilisateurService.clearUser(); // On vide le flux
      localStorage.removeItem('token'); // Si tu as un token
      this.router.navigate(['/login']);
    }
  }
}
