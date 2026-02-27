import { Component, Output, EventEmitter, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface UserProfile {
  nom: string;
  role: string;
  initiales: string;
  email: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  private eRef = inject(ElementRef);
  private router = inject(Router);

  currentUser: UserProfile = {
    nom: 'Xhadee',
    role: 'Administrateur Système',
    initiales: 'XH',
    email: 'xhadee@ipsl.sn'
  };

  profileMenuOpen = false;
  searchQuery: string = '';

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.profileMenuOpen = false;
    }
  }

  /**
   * RECHERCHE GLOBALE
   * Envoie la requête vers la page des produits par défaut,
   * ou peut être adaptée pour rediriger selon des préfixes (ex: "cat: électronique")
   */
  onSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return;

    // Logique de redirection intelligente
    if (query.startsWith('cat:')) {
      this.router.navigate(['/categories'], { queryParams: { q: query.replace('cat:', '').trim() } });
    } else if (query.startsWith('fou:')) {
      this.router.navigate(['/fournisseurs'], { queryParams: { q: query.replace('fou:', '').trim() } });
    } else {
      // Par défaut, on recherche dans les produits
      this.router.navigate(['/produits'], { queryParams: { q: query } });
    }

    this.searchQuery = ''; // Nettoie la barre après recherche
  }

  deconnexion(): void {
    if (confirm("Souhaitez-vous fermer votre session sécurisée ?")) {
      this.router.navigate(['/']).then(() => window.location.reload());
    }
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }
}
