import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-notification-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-history.component.html',
  styleUrls: ['./notification-history.component.css']
})
export class NotificationHistoryComponent implements OnInit {
  private notificationService = inject(NotificationService);

  notifications: Notification[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.chargerTout();
  }

  chargerTout(): void {
    this.isLoading = true;
    this.notificationService.getAll().subscribe({
      next: (data) => {
        this.notifications = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'historique', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * FIX: Méthode manquante demandée par le HTML
   */
  getIcon(type: string): string {
    return type === 'ALERTE' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill';
  }

  supprimer(id: number): void {
    this.notificationService.supprimer(id).subscribe({
      next: () => {
        // Filtrage local pour une interface réactive sans recharger la page
        this.notifications = this.notifications.filter(n => n.id !== id);
      },
      error: (err) => console.error('Erreur lors de la suppression', err)
    });
  }

  marquerLue(id: number): void {
    this.notificationService.marquerCommeLue(id).subscribe({
      next: () => {
        const notif = this.notifications.find(n => n.id === id);
        if (notif) notif.lu = true;
      },
      error: (err) => console.error('Erreur lors du marquage', err)
    });
  }
}
