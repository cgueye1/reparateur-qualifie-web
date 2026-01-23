import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserConnected } from '../../models/user/userConnected';
import { environment } from '../../../environments/environments';

/**
 * Service de gestion de l'état utilisateur connecté
 * Source de vérité unique pour les données utilisateur dans toute l'application
 */
@Injectable({
    providedIn: 'root'
})
export class UserStateService {

    private currentUserSubject = new BehaviorSubject<UserConnected | null>(null);
    public currentUser$: Observable<UserConnected | null> = this.currentUserSubject.asObservable();

    constructor() { }

    /**
     * Définir l'utilisateur connecté (après login ou mise à jour)
     */
    setUser(user: UserConnected | null): void {
        this.currentUserSubject.next(user);
    }

    /**
     * Obtenir l'utilisateur actuel (valeur synchrone)
     */
    getUser(): UserConnected | null {
        return this.currentUserSubject.value;
    }

    /**
     * Effacer l'utilisateur (lors de la déconnexion)
     */
    clearUser(): void {
        this.currentUserSubject.next(null);
    }

    /**
     * Construire l'URL de la photo de profil
     * @param photo nom du fichier photo retourné par l'API
     * @returns URL complète ou chaîne vide
     */
    getPhotoUrl(photo: string | null | undefined): string {
        if (!photo) return '';
        if (photo.startsWith('http')) return photo;
        return `${environment.imageUrl}/${photo}`;
    }

    /**
     * Obtenir les initiales de l'utilisateur
     */
    getUserInitials(user: UserConnected | null): string {
        if (!user) return '';
        const prenom = user.prenom?.[0] || '';
        const nom = user.nom?.[0] || '';
        return `${prenom}${nom}`.toUpperCase();
    }
}
