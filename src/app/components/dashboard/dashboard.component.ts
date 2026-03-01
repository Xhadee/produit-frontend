import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { ProduitService } from '../../services/produit.service';
import { NotificationService } from '../../services/notification.service';
import { Produit } from '../../models/produit.model';

// Pour le PDF (nécessite npm install jspdf jspdf-autotable)
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private produitService = inject(ProduitService);
  private notificationService = inject(NotificationService);

  // Statistiques calculées
  totalProduits = 0;
  valeurStock = 0;
  alertesCount = 0;
  categoriesCount = 0;

  // Liste des produits en alerte critique
  topAlertes: Produit[] = [];

  private chartColors = ['#4361ee', '#3f37c9', '#4895ef', '#4cc9f0', '#f72585', '#7209b7', '#b5179e'];

  public chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#64748b',
          usePointStyle: true,
          font: { family: 'Inter', size: 12, weight: 'bold' },
          padding: 20
        }
      }
    }
  };

  public chartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };

  ngOnInit() {
    this.chargerStatistiques();
  }

  private chargerStatistiques() {
    this.produitService.getProduits().subscribe({
      next: (produits) => {
        // 1. Calculs des compteurs
        this.totalProduits = produits.length;

        // Calcul de la valeur totale du stock
        this.valeurStock = produits.reduce((acc, p) => {
          const prix = p.prixUnitaire || 0;
          const qte = p.quantiteStock || 0;
          return acc + (prix * qte);
        }, 0);

        // 2. Identification des produits critiques (Stock <= Seuil)
        const produitsEnAlerte = produits.filter(p => {
          const stock = p.quantiteStock ?? 0;
          const seuil = p.seuilAlerte ?? 5; // Seuil par défaut à 5 si non défini
          return stock <= seuil;
        });

        this.alertesCount = produitsEnAlerte.length;

        // On récupère les 5 plus critiques pour le tableau du dashboard
        this.topAlertes = [...produitsEnAlerte]
          .sort((a, b) => (a.quantiteStock || 0) - (b.quantiteStock || 0))
          .slice(0, 5);

        // 3. Groupement par catégorie pour le graphique
        const catMap = new Map<string, number>();
        produits.forEach(p => {
          const nomCat = p.categorie?.nom || 'Sans catégorie';
          catMap.set(nomCat, (catMap.get(nomCat) || 0) + 1);
        });
        this.categoriesCount = catMap.size;

        // 4. Configuration du dataset
        const dataset: any = {
          data: Array.from(catMap.values()),
          backgroundColor: this.chartColors,
          borderWidth: 0,
          hoverOffset: 20,
          cutout: '75%'
        };

        this.chartData = {
          labels: Array.from(catMap.keys()),
          datasets: [dataset]
        };

        // 5. Mise à jour des notifications (optionnel ici, car géré par la Navbar)
        this.notificationService.getNonLues().subscribe();
      },
      error: (err) => console.error('Erreur Dashboard:', err)
    });
  }

  /**
   * ACTION : Générer le rapport PDF d'inventaire
   */
  genererRapportPDF() {
    const doc = new jsPDF();

    // Titre et style du document
    doc.setFontSize(22);
    doc.setTextColor(67, 97, 238); // Bleu IPSL
    doc.text('RAPPORT D\'INVENTAIRE IA', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Date du rapport : ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Valeur totale du stock : ${this.valeurStock.toLocaleString()} FCFA`, 14, 34);

    // Préparation des données pour le tableau
    const body = this.topAlertes.map(p => [
      p.id || '-',
      p.designation,
      p.quantiteStock,
      p.seuilAlerte,
      p.quantiteStock === 0 ? 'RUPTURE' : 'CRITIQUE'
    ]);

    // Génération du tableau automatique
    autoTable(doc, {
      startY: 45,
      head: [['ID', 'Désignation', 'Stock Actuel', 'Seuil', 'Statut']],
      body: body,
      headStyles: { fillColor: [67, 97, 238], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 251] },
      margin: { top: 45 }
    });

    // Téléchargement du fichier
    doc.save(`Rapport_Stock_${new Date().toISOString().split('T')[0]}.pdf`);
  }
}
