import { PlanAbonnement } from "../plan-d'abonnement/plan-abonnement";
import { User } from "../utilisateurs/utilisateur";


/**
 * Vérification / Badge utilisateur
 */
export interface Verification {
  id: number;

  user: User;

  badgePlan: PlanAbonnement;

  startDate: string;

  endDate: string;

  amountPaid: number;

  active: boolean;

  status: 'PENDING' | 'VALIDATED' | 'REJECTED';
}


/**
 * Document utilisateur (API: user-document-controller)
 */
export type DocumentStatus = 'PENDING' | 'VALIDATED' | 'REJECTED' | 'NEEDS_COMPLETION';

export interface UserDocument {
  id: number;
  name: string;
  fileUrl: string;
  status: DocumentStatus;
  comment: string | null;
  user: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
}


export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // page courante
}
