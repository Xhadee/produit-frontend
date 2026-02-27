import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FournisseurService } from '../../services/fournisseur.service';
import { Fournisseur } from '../../models/fournisseur.model';

@Component({
  selector: 'app-fournisseur-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './fournisseur-list.component.html',
  styleUrls: ['./fournisseur-list.component.css']
})
export class FournisseurListComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];
  fournisseursFiltres: Fournisseur[] = []; // SANS ACCENT (OK pour NG5002)

  fournisseurForm!: FormGroup;
  searchTerm: string = '';
  isEditMode = false;
  selectedId?: number;

  constructor(
    private fournisseurService: FournisseurService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.chargerFournisseurs();
  }

  initForm(): void {
    this.fournisseurForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]],
      telephone: ['', [Validators.required]],
      adresse: ['']
    });
  }

  // Couleurs d'avatars basées sur le nom (Esthétique)
  getAvatarColor(name: string): string {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#64748b'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  chargerFournisseurs(): void {
    this.fournisseurService.getFournisseurs().subscribe({
      next: (data) => {
        this.fournisseurs = data;
        this.filtrerFournisseurs();
      }
    });
  }

  filtrerFournisseurs(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.fournisseursFiltres = this.fournisseurs.filter(f =>
      f.nom.toLowerCase().includes(term) ||
      (f.adresse && f.adresse.toLowerCase().includes(term))
    );
  }

  preparerAjout(): void {
    this.isEditMode = false;
    this.selectedId = undefined;
    this.fournisseurForm.reset();
  }

  preparerEdition(f: Fournisseur, event: Event): void {
    event.stopPropagation();
    this.isEditMode = true;
    this.selectedId = f.id;
    this.fournisseurForm.patchValue(f);
  }

  onSubmit(): void {
    if (this.fournisseurForm.valid) {
      const data = this.fournisseurForm.value;
      const op = (this.isEditMode && this.selectedId)
        ? this.fournisseurService.modifierFournisseur(this.selectedId, data)
        : this.fournisseurService.creerFournisseur(data);

      op.subscribe(() => this.reinitialiser());
    }
  }

  supprimer(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Supprimer ce partenaire ?')) {
      this.fournisseurService.supprimerFournisseur(id).subscribe(() => this.chargerFournisseurs());
    }
  }

  voirDetails(id: number): void {
    this.router.navigate(['/fournisseur', id]);
  }

  reinitialiser(): void {
    this.chargerFournisseurs();
    this.fournisseurForm.reset();
    document.getElementById('closeFournModal')?.click();
  }
}
