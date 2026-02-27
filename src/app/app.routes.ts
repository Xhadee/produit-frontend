import { Routes } from '@angular/router';
import { ProduitListComponent } from './components/produit-list/produit-list.component';
import { ProduitDetailsComponent } from "./components/produit-details/produit-details.component";
import { CategorieListComponent } from "./components/categorie-list/categorie-list.component";
import { CategorieDetailsComponent } from "./components/categorie-details/categorie-details.component";
import { FournisseurListComponent } from "./components/fournisseur-list/fournisseur-list.component";
import { FournisseurDetailsComponent } from "./components/fournisseur-details/fournisseur-details.component";
import { IaAnalyticsComponent } from "./components/ia-analytics/ia-analytics.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { LoginComponent } from "./components/login/login.component"; // IMPORT DU LOGIN
import { authGuard } from "./guards/auth.guard"; // IMPORT DU GUARD

export const routes: Routes = [
  // --- ROUTES PUBLIQUES ---
  { path: 'login', component: LoginComponent },

  // --- ROUTES PROTÉGÉES (Nécessitent une connexion) ---
  {
    path: '',
    canActivate: [authGuard], // Protection globale pour tous les enfants
    children: [
      { path: '', redirectTo: 'produits', pathMatch: 'full' },

      // Gestion des Produits
      { path: 'produits', component: ProduitListComponent },
      { path: 'produit/:id', component: ProduitDetailsComponent },

      // Gestion des Catégories
      { path: 'categories', component: CategorieListComponent },
      { path: 'categorie/:id', component: CategorieDetailsComponent },

      // Gestion des Fournisseurs
      { path: 'fournisseurs', component: FournisseurListComponent },
      { path: 'fournisseur/:id', component: FournisseurDetailsComponent },

      // Analyse IA
      { path: 'analyse', component: IaAnalyticsComponent },

      // Système & Configuration
      { path: 'parametres', component: SettingsComponent },
    ]
  },

  // --- GESTION DES ERREURS ---
  { path: '**', redirectTo: 'login' }
];
