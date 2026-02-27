import { Produit } from './produit.model';
import { TypeMouvement } from './type-mouvement.model';

export interface MouvementStock {
  id?: number;
  // On garde la référence au produit (même si @JsonIgnore est présent côté Back,
  // on en aura besoin pour envoyer des données vers le Back)
  produit?: Produit;
  quantite: number;
  type: TypeMouvement;
  dateMouvement?: Date | string; // LocalDateTime est reçu sous forme de chaîne ISO
}
