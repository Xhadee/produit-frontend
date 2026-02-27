export interface Notification {
  id: number;
  titre: string;
  message: string;
  type: 'INFO' | 'ALERTE' | 'SUCCES';
  dateCreation: string;
  lu: boolean;
}
