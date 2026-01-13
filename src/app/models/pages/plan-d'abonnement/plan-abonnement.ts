export interface PlanAbonnement {
  id: number;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyDiscount: number;
}
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // page courante
}
