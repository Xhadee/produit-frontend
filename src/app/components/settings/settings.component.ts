import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilisateurService, Utilisateur } from '../../services/utilisateur.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  activeTab: string = 'profil';
  settingsForm!: FormGroup;
  isLoading = false;
  messageFeedback = { type: '', text: '' };

  private fb = inject(FormBuilder);
  private utilisateurService = inject(UtilisateurService);

  languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.chargerDonneesUtilisateur();
  }

  initForm() {
    this.settingsForm = this.fb.group({
      id: [null], // Important pour l'update
      username: [{ value: '', disabled: true }], // On ne change pas le username généralement
      nom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [''], // Optionnel pour le changement
      // Paramètres locaux (peuvent rester en local ou être ajoutés au modèle)
      langue: ['fr'],
      seuilAlerte: [5],
    });
  }

  chargerDonneesUtilisateur() {
    this.isLoading = true;
    this.utilisateurService.getMe().subscribe({
      next: (user) => {
        this.settingsForm.patchValue({
          id: user.id,
          username: user.username,
          nom: user.nom,
          email: user.email,
          seuilAlerte: 5 // Valeur par défaut si non gérée par l'objet User
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.showFeedback('danger', 'Impossible de charger le profil');
        this.isLoading = false;
      }
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  onSubmit() {
    if (this.settingsForm.valid) {
      this.isLoading = true;
      // On récupère toutes les valeurs, y compris les champs désactivés si besoin
      const userData = this.settingsForm.getRawValue();

      this.utilisateurService.updateProfil(userData).subscribe({
        next: (response) => {
          this.showFeedback('success', 'Profil mis à jour avec succès !');
          this.isLoading = false;
          // Si un mot de passe a été saisi, on vide le champ après succès
          this.settingsForm.get('password')?.reset();
        },
        error: (err) => {
          this.showFeedback('danger', 'Erreur lors de la mise à jour');
          this.isLoading = false;
        }
      });
    }
  }

  private showFeedback(type: string, text: string) {
    this.messageFeedback = { type, text };
    setTimeout(() => this.messageFeedback = { type: '', text: '' }, 4000);
  }
}
