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



export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // page courante
}
