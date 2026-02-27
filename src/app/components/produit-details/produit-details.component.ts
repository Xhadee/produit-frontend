import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProduitService } from '../../services/produit.service';
import { Produit } from '../../models/produit.model';
import { TypeMouvement } from "../../models/type-mouvement.model";
import { MouvementStock } from "../../models/mouvement-stock.model";

@Component({
  selector: 'app-produit-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './produit-details.component.html',
  styleUrls: ['./produit-details.component.css']
})
export class ProduitDetailsComponent implements OnInit {
  produit?: Produit;
  mouvements: MouvementStock[] = [];
  chargement = true;

  // Exposition de l'Enum pour le template HTML
  public TypeMvt = TypeMouvement;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    this.refreshData();
  }

  /**
   * Charge les informations du produit et son historique
   */
  refreshData(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || isNaN(id)) {
      this.router.navigate(['/produits']);
      return;
    }

    this.chargement = true;
    this.produitService.getProduitById(id).subscribe({
      next: (data) => {
        this.produit = data;
        // Une fois le produit chargé, on récupère ses mouvements
        this.chargerHistorique(id);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du produit', err);
        this.chargement = false;
      }
    });
  }

  /**
   * Récupère la liste des mouvements depuis le backend
   */
  private chargerHistorique(id: number): void {
    this.produitService.getMouvementsByProduit(id).subscribe({
      next: (mvts) => {
        // Le backend renvoie déjà la liste triée (Desc), plus besoin de .sort() ici
        this.mouvements = mvts;
        this.chargement = false;
      },
      error: (err) => {
        console.error("Erreur lors du chargement de l'historique", err);
        this.chargement = false;
        this.mouvements = []; // Évite de garder d'anciens mouvements en cas d'erreur
      }
    });
  }

  /**
   * Déclenche une entrée ou une sortie de stock
   */
  enregistrerMouvement(type: TypeMouvement): void {
    if (!this.produit || this.produit.id === undefined) return;

    const label = type === TypeMouvement.ENTREE ? 'entrée' : 'sortie';
    const quantiteStr = prompt(`Quantité pour la ${label} de stock :`);

    if (quantiteStr === null) return;

    const quantite = Number(quantiteStr);

    if (isNaN(quantite) || quantite <= 0) {
      alert('Veuillez saisir un nombre valide supérieur à 0.');
      return;
    }

    // Sécurité côté client (en complément de la sécurité Backend)
    if (type === TypeMouvement.SORTIE && quantite > (this.produit.quantiteStock || 0)) {
      alert(`Action impossible : stock insuffisant (Disponible: ${this.produit.quantiteStock})`);
      return;
    }

    const obs = type === TypeMouvement.ENTREE
      ? this.produitService.enregistrerEntree(this.produit.id, quantite)
      : this.produitService.enregistrerSortie(this.produit.id, quantite);

    obs.subscribe({
      next: () => {
        // Recharger les données pour voir le nouveau stock et le nouveau mouvement
        this.refreshData();
      },
      error: (err) => {
        console.error('Erreur API Stock:', err);
        // On affiche le message d'erreur du backend si disponible
        const message = err.error?.message || "L'opération a échoué.";
        alert(message);
      }
    });
  }

  retour(): void {
    this.router.navigate(['/produits']);
  }
}
