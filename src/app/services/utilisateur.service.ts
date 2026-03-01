import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map, of } from 'rxjs';

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

  // --- Sujets de données ---
  private userSubject = new BehaviorSubject<Utilisateur | null>(this.getInitialUser());
  user$ = this.userSubject.asObservable();

  // État de transition pour le Welcome Screen
  private isWelcomingSubject = new BehaviorSubject<boolean>(false);
  isWelcoming$ = this.isWelcomingSubject.asObservable();

  constructor() {}

  /**
   * Vérification initiale du stockage local
   */
  private getInitialUser(): Utilisateur | null {
    const savedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        this.logout();
        return null;
      }
    }
    return null;
  }

  /**
   * Pilote l'affichage du Welcome Screen depuis les composants
   */
  setWelcoming(value: boolean): void {
    this.isWelcomingSubject.next(value);
  }

  /**
   * AUTH : Connexion
   */
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.AUTH_URL}/login`, { username, password }).pipe(
      tap(res => {
        const token = res.token || res.accessToken;
        if (token) localStorage.setItem('token', token);

        const user = res.user || res;
        this.setSession(user);
      })
    );
  }

  /**
   * AUTH : Inscription
   */
  register(user: Partial<Utilisateur>): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.AUTH_URL}/register`, user);
  }

  /**
   * GUARD : Vérification de session
   */
  isLoggedIn(): Observable<boolean> {
    const hasToken = !!localStorage.getItem('token');
    const hasUser = !!localStorage.getItem('currentUser');
    if (hasToken && hasUser) return of(true);
    return this.user$.pipe(map(user => !!user && hasToken));
  }

  /**
   * PROFIL : Données de l'utilisateur courant
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
          this.setSession({ ...currentUser, ...user });
        }
      })
    );
  }

  /**
   * LOGOUT : Nettoyage global
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.setWelcoming(false); // Sécurité : on cache le welcome screen si on déconnecte
  }

  clearUser(): void {
    this.logout();
  }

  /**
   * Centralisation du stockage
   */
  private setSession(user: Utilisateur): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.userSubject.next(user);
  }
}
