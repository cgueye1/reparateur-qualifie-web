export interface UserConnected {
  id: number;
  reference: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adress: string;
  lat: number;
  lon: number;
  profil: string;
  sponsor: string | null;
  activeBadge: string | null;
  averageRating: number;
  ratingCount: number;
  sponsoredUsersCount: number;
  shareCount: number;
}


export interface UpdateUserPayload {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adress: string;
  lat: number;
  lon: number;
  profil: string;
}
