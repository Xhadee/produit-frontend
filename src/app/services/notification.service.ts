import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model'; // Assure-toi que le modèle existe

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/notifications';

  /**
   * Liste toutes les alertes critiques non lues
   */
  getNonLues(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.API_URL}/non-lues`);
  }

  /**
   * Marque une alerte précise comme lue par son ID
   */
  marquerCommeLue(id: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}/lire`, {});
  }

  /**
   * Vide la liste des notifications en les marquant toutes comme lues
   */
  marquerToutCommeLu(): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/tout-lire`, {});
  }
}
