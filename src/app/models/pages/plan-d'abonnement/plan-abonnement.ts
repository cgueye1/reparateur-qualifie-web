export interface PlanAbonnement {
  id: number;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyDiscount: number;
}

export interface PlanStats {
  totalPlans: number;      // Nombre total de plans dans le catalogue
  activePlans: number;     // Nombre de plans ayant au moins 1 abonné actif
  inactivePlans: number;   // Plans sans abonnés actifs
  subscribers: number;     // Nombre total d'utilisateurs abonnés
}

// Interface pour les abonnés affichés dans la page détail
export interface PlanSubscriber {
  nom: string;
  photo: string;
  role: string;        // Métier de l'utilisateur
  telephone: string;
  active: boolean;     // Badge actif ou non
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // page courante
}
