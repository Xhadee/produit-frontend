import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  // Options pour une plateforme pro
  languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' }
  ];

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {}

  initForm() {
    this.settingsForm = this.fb.group({
      // Profil
      nom: ['xhadee', [Validators.required]],
      email: ['contact@xhadee.sn', [Validators.required, Validators.email]],
      // Système
      langue: ['fr'],
      devise: ['XOF'],
      seuilAlerte: [5],
      // Notifications
      notifEmail: [true],
      notifStock: [true]
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  onSubmit() {
    if (this.settingsForm.valid) {
      console.log('Données à envoyer au backend:', this.settingsForm.value);
      // C'est ici qu'on branchera le service plus tard
    }
  }
}
