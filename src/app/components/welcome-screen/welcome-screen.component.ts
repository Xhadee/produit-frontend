import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.css']
})
export class WelcomeScreenComponent implements OnInit {
  isVisible = true;
  isExiting = false;

  ngOnInit(): void {
    // 1. Durée totale de l'animation avant de commencer la sortie
    setTimeout(() => {
      this.isExiting = true;

      // 2. Supprimer le composant du DOM après la fin de la transition CSS
      setTimeout(() => {
        this.isVisible = false;
      }, 800); // Doit correspondre à la durée du transition CSS (0.8s)

    }, 3000); // Temps d'affichage du splash (3 secondes)
  }
}
