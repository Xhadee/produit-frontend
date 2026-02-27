import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PredictionResult } from '../models/prediction.model';

@Injectable({ providedIn: 'root' })
export class IaService {
  private apiUrl = 'http://localhost:8080/api/ia';

  constructor(private http: HttpClient) { }

  getTopVentes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/top-ventes`);
  }

  getAnalyseRupture(id: number): Observable<PredictionResult> {
    return this.http.get<PredictionResult>(`${this.apiUrl}/analyse/${id}`);
  }
}
