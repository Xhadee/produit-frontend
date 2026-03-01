import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Nécessaire pour le [(ngModel)] de la recherche
import { PredictionResult } from "../../models/prediction.model";
import { IaAnalysisService } from "../../services/ia-analysis.service";

@Component({
  selector: 'app-ia-analytics',
  standalone: true,
  // Ajout de FormsModule pour la barre de recherche
  imports: [CommonModule, DecimalPipe, DatePipe, FormsModule],
  templateUrl: './ia-analytics.component.html',
  styleUrls: ['./ia-analytics.component.css']
})
export class IaAnalyticsComponent implements OnInit {

  predictions: PredictionResult[] = [];         // Source de données brute du backend
  predictionsFiltrees: PredictionResult[] = []; // Liste affichée (filtrée par la recherche)

  searchTerm: string = '';
  chargement = true;

  constructor(private iaService: IaAnalysisService) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  /**
   * Récupère les analyses depuis le service et initialise la liste filtrée
   */
  chargerDonnees(): void {
    this.iaService.getAnalyseStock().subscribe({
      next: (data) => {
        this.predictions = data;
        this.predictionsFiltrees = data; // Au début, on affiche tout
        this.chargement = false;
      },
      error: (err) => {
        console.error('Erreur IA:', err);
        this.chargement = false;
      }
    });
  }

  /**
   * Logique de recherche en temps réel
   * Filtre par nom de produit ou par tendance (HAUSSE/BAISSE/STABLE)
   */
  filtrerPredictions(): void {
    const search = this.searchTerm.toLowerCase().trim();

    if (!search) {
      this.predictionsFiltrees = this.predictions;
    } else {
      this.predictionsFiltrees = this.predictions.filter(p =>
        p.nomProduit.toLowerCase().includes(search) ||
        p.tendance.toLowerCase().includes(search)
      );
    }
  }

  /**
   * Retourne une couleur hexadécimale selon l'indice de confiance de l'IA
   */
  getConfianceColor(score: number): string {
    if (score > 0.8) return '#06d6a0'; // Vert émeraude (Succès)
    if (score > 0.5) return '#ffd166'; // Jaune orangé (Attention)
    return '#ef233c';                // Rouge vif (Danger)
  }

  /**
   * Réinitialise la barre de recherche
   */
  resetSearch(): void {
    this.searchTerm = '';
    this.filtrerPredictions();
  }
}
