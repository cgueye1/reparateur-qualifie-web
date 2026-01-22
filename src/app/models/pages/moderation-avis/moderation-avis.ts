// Statut d'un avis
export type RatingStatus = 'PENDING' | 'VALIDATED' | 'REJECTED' | 'HIDDEN';

// Interface Rating (avis)
export interface Rating {
    id: number;

    // Utilisateurs
    reviewer: {
        id: number;
        nom: string;
        prenom: string;
        photo?: string;
    };

    reviewedUser: {
        id: number;
        nom: string;
        prenom: string;
        photo?: string;
    };

    // Contenu
    score: number;              // Note (1-5 étoiles)
    comment: string;            // Commentaire textuel

    // Modération
    status: RatingStatus;       // Statut de modération
    moderatedAt?: string;       // Date de modération
    moderatedBy?: number;       // ID du modérateur
    moderationReason?: string;  // Raison de la modération

    // Signalement
    reportedAt?: string;        // Date de signalement
    reportedBy?: number;        // ID du signaleur
    reportReason?: string;      // Raison du signalement

    // Métadonnées
    createdAt: string;          // Date de création
    updatedAt?: string;         // Date de modification
}

// Statistiques des avis
export interface RatingStats {
    totalRatings: number;       // Total des avis
    pending: number;            // En attente
    solved: number;             // Traités/résolus
    ok: number;                 // Validés/publiés
    hidden: number;             // Masqués
}

// Requête de mise à jour du statut
export interface RatingStatusUpdateRequest {
    status: RatingStatus;       // Nouveau statut
    reason?: string;            // Motif de modération (optionnel)
}

// Page paginée de ratings
export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;             // page courante
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}
