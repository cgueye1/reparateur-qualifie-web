export interface Publicite {
  id: number;

  webImg: string;        // image web
  mobileImg: string;     // image mobile

  title: string;         // titre
  description: string;   // description

  link: string;          // lien de redirection

  startDate: string;     // date début (ISO string)
  endDate: string;       // date fin (ISO string)

  permanent: boolean;    // publicité permanente
}


export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // page courante
}


export interface PubliciteStats {
  totalAds: number;
  activeAds: number;
  inactiveAds: number;
}
