import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategorieService } from '../../services/categorie.service';
import { ProduitService } from '../../services/produit.service';
import { Categorie } from '../../models/categorie.model';
import { Produit } from '../../models/produit.model';

@Component({
  selector: 'app-categorie-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categorie-details.component.html',
  styleUrls: ['./categorie-details.component.css']
})
export class CategorieDetailsComponent implements OnInit {
  categorie?: Categorie;
  produitsAssocies: Produit[] = [];
  chargement = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categorieService: CategorieService,
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.chargerDonnees(id);
    }
  }

  chargerDonnees(id: number): void {
    // 1. Charger la catégorie
    this.categorieService.getCategorieById(id).subscribe({
      next: (cat) => {
        this.categorie = cat;
        // 2. Charger tous les produits et filtrer (ou appeler un endpoint dédié si existant)
        this.produitService.getProduits().subscribe(allProduits => {
          this.produitsAssocies = allProduits.filter(p => p.categorie?.id === id);
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
    this.router.navigate(['/categories']);
  }
}
