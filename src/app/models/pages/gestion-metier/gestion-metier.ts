// src/app/models/metier/trade.model.ts
export interface Metiers {
  id: number;
  name: string;
  img: string;
  description: string;
}

// src/app/models/pagination/page.model.ts
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // page courante
}
