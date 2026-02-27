import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FournisseurService } from '../../services/fournisseur.service';
import { ProduitService } from '../../services/produit.service';
import { Fournisseur } from '../../models/fournisseur.model';
import { Produit } from '../../models/produit.model';

@Component({
  selector: 'app-fournisseur-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './fournisseur-details.component.html',
  styleUrls: ['./fournisseur-details.component.css']
})
export class FournisseurDetailsComponent implements OnInit {
  fournisseur?: Fournisseur;
  produitsFournis: Produit[] = [];
  chargement = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fournisseurService: FournisseurService,
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.chargerDonnees(id);
    }
  }

  chargerDonnees(id: number): void {
    this.fournisseurService.getFournisseurById(id).subscribe({
      next: (f) => {
        this.fournisseur = f;
        // On récupère les produits liés à ce fournisseur
        this.produitService.getProduits().subscribe(produits => {
          this.produitsFournis = produits.filter(p => p.fournisseur?.id === id);
          this.chargement = false;
        });
      },
      error: () => this.chargement = false
    });
  }

  voirProduit(id: number): void {
    this.router.navigate(['/produit', id]);
  }

  retour(): void {
    this.router.navigate(['/fournisseurs']);
  }
}
