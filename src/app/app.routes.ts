import { Routes } from '@angular/router';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ProduitListComponent } from './components/produit-list/produit-list.component';
import { ProduitDetailsComponent } from "./components/produit-details/produit-details.component";
import { CategorieListComponent } from "./components/categorie-list/categorie-list.component";
import { CategorieDetailsComponent } from "./components/categorie-details/categorie-details.component";
import { FournisseurListComponent } from "./components/fournisseur-list/fournisseur-list.component";
import { FournisseurDetailsComponent } from "./components/fournisseur-details/fournisseur-details.component";
import { IaAnalyticsComponent } from "./components/ia-analytics/ia-analytics.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { LoginComponent } from "./components/login/login.component";
import { NotificationHistoryComponent } from "./components/notification-history/notification-history.component"; // <-- Importation ajoutée
import { authGuard } from "./guards/auth.guard";

export const routes: Routes = [
  // 1. ROUTE PUBLIQUE
  {
    path: 'login',
    component: LoginComponent,
    title: 'Connexion - Gestion de Stock'
  },

  // 2. ROUTES PROTÉGÉES (Nécessitent une session active)
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      { path: 'dashboard', component: DashboardComponent, title: 'Tableau de Bord' },

      // --- Gestion des Notifications ---
      {
        path: 'notifications',
        component: NotificationHistoryComponent,
        title: 'Historique des Alertes'
      },

      // Gestion des Produits
      { path: 'produits', component: ProduitListComponent, title: 'Liste des Produits' },
      { path: 'produit/:id', component: ProduitDetailsComponent, title: 'Détails du Produit' },

      // Gestion des Catégories
      { path: 'categories', component: CategorieListComponent, title: 'Catégories' },
      { path: 'categorie/:id', component: CategorieDetailsComponent, title: 'Détails Catégorie' },

      // Gestion des Fournisseurs
      { path: 'fournisseurs', component: FournisseurListComponent, title: 'Fournisseurs' },
      { path: 'fournisseur/:id', component: FournisseurDetailsComponent, title: 'Détails Fournisseur' },

      // Analyse IA
      { path: 'analyse', component: IaAnalyticsComponent, title: 'Analyses IA' },

      // Paramètres
      { path: 'parametres', component: SettingsComponent, title: 'Paramètres Système' },
    ]
  },

  // 3. FALLBACK (Redirige vers login si la route n'existe pas)
  { path: '**', redirectTo: 'dashboard' }
];
