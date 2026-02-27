import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategorieService } from '../../services/categorie.service';
import { Categorie } from '../../models/categorie.model';

@Component({
  selector: 'app-categorie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categorie-list.component.html',
  styleUrls: ['./categorie-list.component.css']
})
export class CategorieListComponent implements OnInit {
  categories: Categorie[] = [];
  categoriesFiltrees: Categorie[] = [];
  categorieForm!: FormGroup;

  // États de l'interface
  isEditMode = false;
  selectedId?: number;
  chargement = true;
  searchTerm = '';

  constructor(
    private categorieService: CategorieService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.chargerCategories();
  }

  initForm(): void {
    this.categorieForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
  }

  chargerCategories(): void {
    this.chargement = true;
    this.categorieService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.appliquerFiltre(); // Initialise la liste affichée
        this.chargement = false;
      },
      error: (err) => {
        console.error('Erreur chargement catégories', err);
        this.chargement = false;
      }
    });
  }

  /**
   * Filtre dynamique pour la recherche (UX)
   */
  appliquerFiltre(): void {
    const q = this.searchTerm.toLowerCase().trim();
    this.categoriesFiltrees = this.categories.filter(c =>
      c.nom.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  }

  voirDetails(id: number): void {
    this.router.navigate(['/categorie', id]);
  }

  onSubmit(): void {
    if (this.categorieForm.valid) {
      const data: Categorie = this.categorieForm.value;
      const operation = (this.isEditMode && this.selectedId)
        ? this.categorieService.modifierCategorie(this.selectedId, data)
        : this.categorieService.creerCategorie(data);

      operation.subscribe({
        next: () => this.reinitialiser(),
        error: (err) => alert("Erreur lors de l'enregistrement.")
      });
    }
  }

  preparerEdition(cat: Categorie, event: Event): void {
    event.stopPropagation();
    this.isEditMode = true;
    this.selectedId = cat.id;
    this.categorieForm.patchValue({
      nom: cat.nom,
      description: cat.description
    });
    // Optionnel: scroller vers le formulaire si nécessaire
  }

  supprimer(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      this.categorieService.supprimerCategorie(id).subscribe({
        next: () => this.chargerCategories(),
        error: () => alert('Impossible de supprimer : cette catégorie contient probablement des produits.')
      });
    }
  }

  reinitialiser(): void {
    this.chargerCategories();
    this.categorieForm.reset();
    this.isEditMode = false;
    this.selectedId = undefined;

    // Fermeture propre du modal Bootstrap
    const modalElement = document.getElementById('categorieModal');
    if (modalElement) {
      const closeBtn = modalElement.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
      closeBtn?.click();
    }
  }
  /**
   * Attribue une icône spécifique en fonction du nom de la catégorie
   * pour un design plus intuitif (UX).
   */
  getIconForCategory(nom: string): string {
    if (!nom) return 'bi bi-box-seam';

    const n = nom.toLowerCase();

    if (n.includes('info') || n.includes('tech') || n.includes('ordinateur')) return 'bi bi-laptop';
    if (n.includes('alim') || n.includes('nour') || n.includes('boisson')) return 'bi bi-egg-fried';
    if (n.includes('vet') || n.includes('habit') || n.includes('mode')) return 'bi bi-shop';
    if (n.includes('meub') || n.includes('deco') || n.includes('maison')) return 'bi bi-house-door';
    if (n.includes('san') || n.includes('medi') || n.includes('pharma')) return 'bi bi-heart-pulse';
    if (n.includes('elec') || n.includes('outil') || n.includes('brico')) return 'bi bi-tools';
    if (n.includes('livre') || n.includes('papeterie') || n.includes('bureau')) return 'bi bi-journal-text';
    if (n.includes('auto') || n.includes('moto') || n.includes('transport')) return 'bi bi-car-front';
    if (n.includes('sport') || n.includes('loisir')) return 'bi bi-trophy';

    // Icône par défaut si aucune correspondance n'est trouvée
    return 'bi bi-box-seam';
  }
}
