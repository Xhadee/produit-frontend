import { Categorie } from './categorie.model';
import { Fournisseur } from './fournisseur.model';

export interface Produit {
  id?: number;
  designation: string;
  prixUnitaire: number;
  quantiteStock: number;
  seuilAlerte: number;
  imageUrl?: string;          // Ajout du champ pour l'URL de l'image

  categorie?: Categorie;
  fournisseur?: Fournisseur;
}
