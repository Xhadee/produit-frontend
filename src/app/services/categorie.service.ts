import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categorie } from '../models/categorie.model';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) { }

  // Lister toutes les catégories (GET)
  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl);
  }

  // Obtenir une seule catégorie (GET /id)
  getCategorieById(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}/${id}`);
  }

  // Créer une catégorie (POST)
  creerCategorie(categorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(this.apiUrl, categorie);
  }

  // Modifier une catégorie (PUT)
  modifierCategorie(id: number, categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}/${id}`, categorie);
  }

  // Supprimer une catégorie (DELETE)
  supprimerCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
