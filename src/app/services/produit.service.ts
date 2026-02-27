import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Ajout de HttpParams
import { Observable } from 'rxjs';
import { Produit } from '../models/produit.model';
import { MouvementStock } from "../models/mouvement-stock.model";

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:8080/api/produits';
  private stockUrl = 'http://localhost:8080/api/stock';

  constructor(private http: HttpClient) { }

  /* --- CRUD PRODUITS --- */
  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  getProduitById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

  creerProduit(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, produit);
  }

  modifierProduit(id: number, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}`, produit);
  }

  supprimerProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProduitsEnAlerte(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/alertes`);
  }

  /* --- GESTION DES MOUVEMENTS DE STOCK --- */

  /**
   * Correction : Utilisation de HttpParams pour envoyer 'quantite' en tant que @RequestParam
   * Le body est envoyé vide ({}) car le backend n'attend pas d'objet JSON.
   */
  enregistrerSortie(id: number, quantite: number): Observable<MouvementStock> {
    const params = new HttpParams().set('quantite', quantite.toString());
    return this.http.post<MouvementStock>(`${this.stockUrl}/sortie/${id}`, {}, { params });
  }

  enregistrerEntree(id: number, quantite: number): Observable<MouvementStock> {
    const params = new HttpParams().set('quantite', quantite.toString());
    return this.http.post<MouvementStock>(`${this.stockUrl}/entree/${id}`, {}, { params });
  }

  getMouvementsByProduit(id: number): Observable<MouvementStock[]> {
    return this.http.get<MouvementStock[]>(`${this.stockUrl}/mouvements/${id}`);
  }

  /* --- RECHERCHE --- */
  searchProduits(query: string, produits: Produit[]): Produit[] {
    const q = query.toLowerCase().trim();
    if (!q) return produits;

    return produits.filter(p =>
      p.designation?.toLowerCase().includes(q) ||
      p.id?.toString().includes(q) ||
      (p.categorie?.nom && p.categorie.nom.toLowerCase().includes(q)) ||
      (p.fournisseur?.nom && p.fournisseur.nom.toLowerCase().includes(q))
    );
  }
}
