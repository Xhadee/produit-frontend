import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {PredictionResult} from "../models/prediction.model";


@Injectable({
  providedIn: 'root'
})
export class IaAnalysisService {
  // L'URL de ton IAController Spring Boot
  private apiUrl = 'http://localhost:8080/api/ia';

  constructor(private http: HttpClient) { }

  /**
   * Récupère l'analyse complète de tous les produits (Dashboard)
   */
  getAnalyseStock(): Observable<PredictionResult[]> {
    return this.http.get<PredictionResult[]>(`${this.apiUrl}/analyse-complete`);
  }

  /**
   * Récupère la prédiction pour un produit spécifique
   */
  getPredictionProduit(id: number): Observable<PredictionResult> {
    return this.http.get<PredictionResult>(`${this.apiUrl}/analyse/${id}`);
  }

  /**
   * Récupère le texte du produit star
   */
  getProduitStar(): Observable<string> {
    // Comme le controller renvoie un String brut, on précise responseType: 'text'
    return this.http.get(`${this.apiUrl}/top-ventes`, { responseType: 'text' });
  }
}
