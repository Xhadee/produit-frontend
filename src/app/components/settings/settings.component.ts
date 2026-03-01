import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilisateurService } from '../../services/utilisateur.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private utilisateurService = inject(UtilisateurService);

  // État de l'interface
  activeTab: string = 'profil'; // profil | securite | preferences
  isLoading = false;
  isSaving = false;

  // Feedback visuel
  messageFeedback = { type: '', text: '' };

  settingsForm!: FormGroup;

  languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.chargerDonneesUtilisateur();
  }

  /**
   * Initialisation du formulaire réactif
   */
  initForm() {
    this.settingsForm = this.fb.group({
      id: [null],
      username: [{ value: '', disabled: true }], // Lecture seule
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],

      // Sécurité
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],

      // Préférences (Stockage local ou étendu)
      langue: ['fr'],
      seuilAlerte: [5, [Validators.required, Validators.min(1)]],
      notificationsEmail: [true]
    });
  }

  /**
   * Récupération des données du profil "Moi"
   */
  chargerDonneesUtilisateur() {
    this.isLoading = true;
    this.utilisateurService.getMe().subscribe({
      next: (user) => {
        this.settingsForm.patchValue({
          id: user.id,
          username: user.username,
          nom: user.nom,
          email: user.email,
          // Récupération des préférences depuis le stockage local si non présentes en DB
          langue: localStorage.getItem('app_lang') || 'fr',
          seuilAlerte: localStorage.getItem('app_seuil_alerte') || 5
        });
        this.isLoading = false;
      },
      error: () => {
        this.showFeedback('danger', 'Erreur lors de la récupération du profil');
        this.isLoading = false;
      }
    });
  }

  /**
   * Enregistrement des modifications
   */
  onSubmit() {
    if (this.settingsForm.invalid) {
      this.showFeedback('warning', 'Veuillez remplir correctement tous les champs obligatoires');
      return;
    }

    this.isSaving = true;
    const formData = this.settingsForm.getRawValue();

    this.utilisateurService.updateProfil(formData).subscribe({
      next: () => {
        this.showFeedback('success', 'Vos modifications ont été enregistrées');
        this.isSaving = false;

        // Persistance locale des préférences UI
        localStorage.setItem('app_lang', formData.langue);
        localStorage.setItem('app_seuil_alerte', formData.seuilAlerte.toString());

        // Nettoyage des champs de mot de passe après succès
        this.settingsForm.patchValue({ currentPassword: '', newPassword: '' });
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Une erreur est survenue lors de la sauvegarde';
        this.showFeedback('danger', errorMsg);
        this.isSaving = false;
      }
    });
  }

  /**
   * Navigation entre les sections (Profil / Sécurité / Paramètres)
   */
  setTab(tab: string) {
    this.activeTab = tab;
  }

  /**
   * Gestion de l'affichage des alertes de feedback
   */
  private showFeedback(type: string, text: string) {
    this.messageFeedback = { type, text };
    setTimeout(() => this.messageFeedback = { type: '', text: '' }, 3000);
  }

  // Helper pour l'affichage des erreurs dans le HTML
  get f() { return this.settingsForm.controls; }
}
