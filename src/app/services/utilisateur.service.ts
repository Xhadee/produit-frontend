import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';

export interface Utilisateur {
  id?: number;
  username: string;
  nom: string;
  email: string;
  role: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/utilisateurs';
  private readonly AUTH_URL = 'http://localhost:8080/api/auth';

  private userSubject = new BehaviorSubject<Utilisateur | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.userSubject.next(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  /**
   * AUTH : Connexion
   */
  login(username: string, password: string): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.AUTH_URL}/login`, { username, password }).pipe(
      tap(user => this.setSession(user))
    );
  }

  /**
   * AUTH : Inscription
   */
  register(user: Partial<Utilisateur>): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.AUTH_URL}/register`, user);
  }

  /**
   * GUARD : Vérifie si l'utilisateur est connecté
   */
  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user)
    );
  }

  /**
   * PROFIL : Récupère les infos actuelles
   */
  getMe(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.API_URL}/me`).pipe(
      tap(user => this.setSession(user))
    );
  }

  /**
   * UPDATE : Mise à jour du profil
   */
  updateProfil(user: Utilisateur): Observable<string> {
    return this.http.put(`${this.API_URL}/update`, user, { responseType: 'text' }).pipe(
      tap(() => {
        const currentUser = this.userSubject.value;
        if (currentUser) {
          const updated = { ...currentUser, ...user };
          // On ne stocke pas le password en local s'il est présent
          delete updated.password;
          this.setSession(updated);
        }
      })
    );
  }

  /**
   * SESSION : Nettoie les données (utilisé par Navbar)
   */
  clearUser(): void {
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
  }

  /**
   * Alias de déconnexion
   */
  logout(): void {
    this.clearUser();
  }

  /**
   * Centralisation de la mise à jour du stockage
   */
  private setSession(user: Utilisateur) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.userSubject.next(user);
  }
}
