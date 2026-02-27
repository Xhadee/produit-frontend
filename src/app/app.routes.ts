import { Routes } from '@angular/router';
import { Routes as RouterRoutes } from '@angular/router'; // Pour lever toute ambiguïté
import { ProduitListComponent } from './components/produit-list/produit-list.component';
import { ProduitDetailsComponent } from "./components/produit-details/produit-details.component";
import { CategorieListComponent } from "./components/categorie-list/categorie-list.component";
import { CategorieDetailsComponent } from "./components/categorie-details/categorie-details.component";
import { FournisseurListComponent } from "./components/fournisseur-list/fournisseur-list.component";
import { FournisseurDetailsComponent } from "./components/fournisseur-details/fournisseur-details.component";
import { IaAnalyticsComponent } from "./components/ia-analytics/ia-analytics.component";
import { SettingsComponent } from "./components/settings/settings.component"; // NOUVEL IMPORT

export const routes: RouterRoutes = [
  // 1. Redirection de la racine vers le tableau de bord (produits)
  { path: '', redirectTo: '/produits', pathMatch: 'full' },

  // 2. Gestion des Produits
  { path: 'produits', component: ProduitListComponent },
  { path: 'produit/:id', component: ProduitDetailsComponent },

  // 3. Gestion des Catégories
  { path: 'categories', component: CategorieListComponent },
  { path: 'categorie/:id', component: CategorieDetailsComponent },

  // 4. Gestion des Fournisseurs
  { path: 'fournisseurs', component: FournisseurListComponent },
  { path: 'fournisseur/:id', component: FournisseurDetailsComponent },

  // 5. Analyse IA (Module prédictif)
  { path: 'analyse', component: IaAnalyticsComponent },

  // 6. Système & Configuration (NOUVELLE ROUTE)
  { path: 'parametres', component: SettingsComponent },

  // 7. Gestion des erreurs (Wildcard) - Toujours en dernier
  { path: '**', redirectTo: '/produits' }
]
