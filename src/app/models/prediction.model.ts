export interface PredictionResult {
  produitId: number;
  nomProduit: string;
  joursRestants: number;
  tendance: 'HAUSSE' | 'BAISSE' | 'STABLE';
  message: string;
  imageUrl?: string;


  confianceIA: number;          // Pourcentage (ex: 0.95 pour 95%)
  quantiteSuggeree: number;     // Combien commander exactement ?
  impactFinancier: number;      // Perte estimée si rupture de stock
  estSaisonnier: boolean;       // Est-ce lié à une période (ex: Ramadan, Tabaski) ?
  dateRupturePrevue: Date;      // Une date précise pour l'agenda
}
