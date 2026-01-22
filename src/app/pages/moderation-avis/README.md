# Module Modération des Avis

## 📋 État d'implémentation

### ✅ Fonctionnalités opérationnelles

- **Statistiques des avis** : Cards affichant les KPIs (total, en attente, résolus)
  - Endpoint : `GET /api/ratings/stats`
  - État : ✅ Fonctionnel

- **Mise à jour du statut** : Actions de modération (approuver, masquer, rejeter)
  - Endpoint : `PATCH /api/ratings/{id}/status`
  - État : ✅ Fonctionnel

### ⚠️ Limitations actuelles

- **Liste des avis** : Tableau de modération non disponible
  - Raison : L'API ne fournit pas d'endpoint pour lister tous les avis
  - État : ❌ Non implémenté

## 📡 Endpoints API disponibles

```
✅ GET  /api/ratings/stats                    → Statistiques globales
✅ GET  /api/ratings/received/{userId}        → Avis reçus par un utilisateur
✅ GET  /api/ratings/given-by-user/{userId}   → Avis donnés par un utilisateur
✅ PATCH /api/ratings/{id}/status             → Mise à jour du statut
❌ GET  /api/ratings                          → Liste tous les avis (MANQUANT)
❌ GET  /api/ratings/{id}                     → Détails d'un avis (MANQUANT)
```

## 🔧 Endpoints requis pour la modération complète

Pour activer la fonctionnalité de liste et modération, le backend doit implémenter :

### 1. Liste paginée de tous les avis

```http
GET /api/ratings?status={status}&page={page}&size={size}

Query Parameters:
- status (optional): PENDING | VALIDATED | REJECTED | HIDDEN
- page (optional): numéro de page (0-based)
- size (optional): nombre d'éléments par page

Response: Page<Rating>
{
  "content": [
    {
      "id": 1,
      "reviewer": { "id": 1, "nom": "Sow", "prenom": "Moussa" },
      "reviewedUser": { "id": 2, "nom": "Diop", "prenom": "Fatou" },
      "score": 4,
      "comment": "Très bon service",
      "status": "PENDING",
      "reportReason": "Commentaire inapproprié",
      "createdAt": "2025-01-15T10:30:00",
      "moderatedAt": null,
      "moderatedBy": null
    }
  ],
  "totalPages": 5,
  "totalElements": 42,
  "size": 10,
  "number": 0
}
```

### 2. Détails d'un avis par ID

```http
GET /api/ratings/{id}

Response: Rating
{
  "id": 1,
  "reviewer": { ... },
  "reviewedUser": { ... },
  "score": 4,
  "comment": "Très bon service",
  "status": "PENDING",
  "reportReason": "Commentaire inapproprié",
  "createdAt": "2025-01-15T10:30:00",
  "moderatedAt": null,
  "moderatedBy": null
}
```

## 🎯 Activation de la fonctionnalité

Une fois les endpoints ajoutés au backend :

1. **Décommenter le code dans le service** :
   - Fichier : `src/app/core/service/pages/moderation-avis/moderation-avis.service.ts`
   - Méthodes : `getRatings()`, `getRatingById()`

2. **Décommenter le code dans le component** :
   - Fichier : `src/app/pages/moderation-avis/moderation-avis/moderation-avis.component.ts`
   - Méthode : `loadRatings()` - remplacer par l'appel au service

3. **Vérifier le template** :
   - Fichier : `src/app/pages/moderation-avis/moderation-avis/moderation-avis.component.html`
   - Le template est déjà prêt avec loading/empty states

## 📊 Structure des données

### RatingStats
```typescript
{
  totalRatings: number;
  pending: number;      // En attente de modération
  solved: number;       // Modérés (validés ou rejetés)
  ok: number;          // Validés
  hidden: number;      // Masqués
}
```

### Rating
```typescript
{
  id: number;
  reviewer: User;           // Auteur de l'avis
  reviewedUser: User;       // Utilisateur noté
  score: number;            // Note 1-5
  comment: string;
  status: RatingStatus;     // PENDING | VALIDATED | REJECTED | HIDDEN
  reportReason?: string;    // Raison du signalement
  createdAt: string;
  moderatedAt?: string;
  moderatedBy?: User;
}
```

## 🔄 Workflow de modération

1. Admin consulte les statistiques (✅ fonctionne)
2. Admin voit la liste des avis signalés (❌ endpoint manquant)
3. Admin clique sur "Approuver" → `PATCH /api/ratings/{id}/status` avec `{status: "VALIDATED"}` (✅ prêt)
4. Admin clique sur "Masquer" → `PATCH /api/ratings/{id}/status` avec `{status: "HIDDEN"}` (✅ prêt)
5. Admin clique sur "Rejeter" → `PATCH /api/ratings/{id}/status` avec `{status: "REJECTED"}` (✅ prêt)
6. Liste et stats se rechargent automatiquement (✅ implémenté)

## 📝 Notes

- Les statistiques sont fonctionnelles et affichent les vraies données de l'API
- Le système de modération est prêt à être activé dès que l'endpoint sera disponible
- Le code est commenté pour faciliter la réactivation
- Le template affiche un message explicatif en attendant l'endpoint

---

**Dernière mise à jour** : 21 janvier 2026
