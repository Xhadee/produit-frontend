import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // On initialise le signal en vérifiant si un thème était déjà sauvegardé
  // Sinon, on vérifie la préférence du système de l'utilisateur (optionnel mais pro)
  private readonly THEME_KEY = 'ipsl-stock-theme';

  isDarkMode = signal<boolean>(localStorage.getItem(this.THEME_KEY) === 'dark');

  constructor() {
    // L'effet se déclenchera automatiquement à chaque fois que isDarkMode change
    effect(() => {
      this.applyTheme(this.isDarkMode());
    });
  }

  /**
   * Alterne entre le mode sombre et le mode clair
   */
  toggleTheme(): void {
    const newMode = !this.isDarkMode();
    this.isDarkMode.set(newMode);
    localStorage.setItem(this.THEME_KEY, newMode ? 'dark' : 'light');
  }

  /**
   * Applique la classe CSS au body
   */
  private applyTheme(dark: boolean): void {
    if (dark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
