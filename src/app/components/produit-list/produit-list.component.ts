import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ProduitService } from '../../services/produit.service';
import { CategorieService } from '../../services/categorie.service';
import { FournisseurService } from '../../services/fournisseur.service';
import { Produit } from '../../models/produit.model';
import { Categorie } from '../../models/categorie.model';
import { Fournisseur } from '../../models/fournisseur.model';

@Component({
  selector: 'app-produit-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './produit-list.component.html',
  styleUrls: ['./produit-list.component.css']
})
export class ProduitListComponent implements OnInit {
  produits: Produit[] = [];
  categories: Categorie[] = [];
  fournisseurs: Fournisseur[] = [];

  chargement: boolean = true;
  produitsParCategorie: { [key: string]: Produit[] } = {};
  categorieSelectionnee: string = 'Tous';

  p_pageActuelle: number = 1;
  p_taillePage: number = 8;

  searchTerm: string = '';
  produitForm!: FormGroup;
  isEditMode = false;
  selectedProduitId?: number;

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private fournisseurService: FournisseurService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.chargerInitialisation();
  }

  initForm(): void {
    this.produitForm = this.fb.group({
      designation: ['', [Validators.required, Validators.minLength(2)]],
      prixUnitaire: [0, [Validators.required, Validators.min(1)]],
      quantiteStock: [0, [Validators.required, Validators.min(0)]],
      seuilAlerte: [5, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      // On s'assure que ces champs sont requis pour valider le formulaire
      categorie: [null, [Validators.required]],
      fournisseur: [null, [Validators.required]]
    });
  }

  chargerInitialisation(): void {
    this.chargement = true;
    // On charge les données annexes avant les produits pour le mapping
    this.categorieService.getCategories().subscribe(cats => this.categories = cats);
    this.fournisseurService.getFournisseurs().subscribe(fous => this.fournisseurs = fous);
    this.chargerProduits();
  }

  chargerProduits(): void {
    this.produitService.getProduits().subscribe({
      next: (data) => {
        this.produits = data;
        this.grouperEtFiltrer();
        this.chargement = false;
      },
      error: (err) => {
        console.error('Erreur chargement', err);
        this.chargement = false;
      }
    });
  }

  grouperEtFiltrer(): void {
    this.produitsParCategorie = {};
    const term = this.searchTerm.toLowerCase();

    const listeFiltrée = this.produits.filter(p =>
      p.designation.toLowerCase().includes(term) ||
      p.categorie?.nom?.toLowerCase().includes(term)
    );

    this.produitsParCategorie['Tous'] = listeFiltrée;

    listeFiltrée.forEach(p => {
      const catNom = p.categorie?.nom || 'Sans Catégorie';
      if (!this.produitsParCategorie[catNom]) this.produitsParCategorie[catNom] = [];
      this.produitsParCategorie[catNom].push(p);
    });

    if (!this.produitsParCategorie[this.categorieSelectionnee]) {
      this.categorieSelectionnee = 'Tous';
    }
  }

  selectionnerCategorie(nom: string): void {
    this.categorieSelectionnee = nom;
    this.p_pageActuelle = 1;
  }

  getNomsCategories(): string[] {
    return Object.keys(this.produitsParCategorie);
  }

  get produitsPagines(): Produit[] {
    const data = this.produitsParCategorie[this.categorieSelectionnee] || [];
    const debut = (this.p_pageActuelle - 1) * this.p_taillePage;
    return data.slice(debut, debut + this.p_taillePage);
  }

  get totalPages(): number {
    const data = this.produitsParCategorie[this.categorieSelectionnee] || [];
    return Math.ceil(data.length / this.p_taillePage);
  }

  // --- ACTIONS CORRIGÉES ---

  preparerAjout(): void {
    this.isEditMode = false;
    this.selectedProduitId = undefined;
    this.produitForm.reset({
      prixUnitaire: 0,
      quantiteStock: 0,
      seuilAlerte: 5,
      imageUrl: ''
    });
  }

  preparerEdition(produit: Produit): void {
    this.isEditMode = true;
    this.selectedProduitId = produit.id;

    // On utilise patchValue pour remplir le formulaire
    this.produitForm.patchValue({
      designation: produit.designation,
      prixUnitaire: produit.prixUnitaire,
      quantiteStock: produit.quantiteStock,
      seuilAlerte: produit.seuilAlerte,
      imageUrl: produit.imageUrl,
      categorie: produit.categorie,
      fournisseur: produit.fournisseur
    });
  }

  onSubmit(): void {
    if (this.produitForm.valid) {
      // On crée une copie propre des données pour l'envoi
      const produitData: Produit = {
        ...this.produitForm.value,
        id: this.selectedProduitId // Crucial pour la modification
      };

      this.chargement = true;

      // Vérifiez ici si votre service utilise "modifierProduit" ou "updateProduit"
      const request = this.isEditMode && this.selectedProduitId
        ? this.produitService.modifierProduit(this.selectedProduitId, produitData)
        : this.produitService.creerProduit(produitData);

      request.subscribe({
        next: () => {
          this.reinitialiserApresAction();
        },
        error: (err) => {
          console.error('Action échouée', err);
          this.chargement = false;
        }
      });
    }
  }

  // --- UTILS ---

  compareObjects(o1: any, o2: any): boolean {
    // Indispensable pour que le <select> affiche la valeur actuelle en mode édition
    return (o1 && o2) ? o1.id === o2.id : o1 === o2;
  }

  reinitialiserApresAction(): void {
    // On ferme le modal d'abord
    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) closeBtn.click();

    // Puis on rafraîchit la liste
    this.chargerProduits();
    this.isEditMode = false;
    this.selectedProduitId = undefined;
  }

  supprimerProduit(id: number): void {
    if (confirm('Supprimer ce produit ?')) {
      this.produitService.supprimerProduit(id).subscribe(() => this.chargerProduits());
    }
  }

  voirDetails(id: number): void {
    this.router.navigate(['/produit', id]);
  }
}
