import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StockService {
  private apiUrl = 'http://localhost:8080/api/stock';

  constructor(private http: HttpClient) { }

  // POST /api/stock/entree/{id}
  enregistrerEntree(id: number, quantite: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/entree/${id}`, quantite);
  }

  // POST /api/stock/sortie/{id}
  enregistrerSortie(id: number, quantite: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/sortie/${id}`, quantite);
  }
}
