import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  // URL de ton contrôleur Spring Boot
  private readonly API_URL = 'http://localhost:8080/api/notifications';

  /**
   * Pour la Cloche (Navbar) : Récupère uniquement les non lues
   */
  getNonLues(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.API_URL}/non-lues`);
  }

  /**
   * Pour la page Historique : Récupère TOUTES les notifications
   */
  getAll(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.API_URL);
  }

  /**
   * Marquer une notification précise comme lue
   */
  marquerCommeLue(id: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}/lire`, {});
  }

  /**
   * Marquer tout comme lu (Bouton "Tout effacer")
   */
  marquerToutCommeLu(): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/tout-lire`, {});
  }

  /**
   * Supprimer définitivement de la base de données
   */
  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
