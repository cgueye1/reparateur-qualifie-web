import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UtilisateurService } from '../../../core/service/pages/utilisateurs/utilisateur.service';
import { SignupService } from '../../../core/service/auth/signup/signup.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';
import { GestionMetierService } from '../../../core/service/pages/gestion-metier/gestion-metier.service';
import { Metiers } from '../../../models/pages/gestion-metier/gestion-metier';
import { User } from '../../../models/pages/utilisateurs/utilisateur';
import { environment } from '../../../../environments/environments';

// Interface pour les étoiles avec support partiel
interface Star {
  type: 'full' | 'partial' | 'empty';
  fillPercentage?: number;
}

@Component({
  selector: 'app-portail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './portail.component.html',
  styleUrl: './portail.component.css'
})
export class PortailComponent {
  mobileMenuOpen = false;
  showArtisansModal = false;
  searchQuery = '';

  // =====================================================
  // 📊 ARTISANS (DONNÉES RÉELLES API)
  // =====================================================
  topArtisans: User[] = [];      // Top 4 pour la section "Nos artisans"
  allArtisans: User[] = [];      // Tous les artisans pour la recherche (modal)
  loadingArtisans = false;
  artisansError = false;

  // Mock data supprimé, on utilise allArtisans maintenant
  artisans: User[] = [];

  // =====================================================
  // � MODAL ARTISANS STATE
  // =====================================================
  modalArtisans: User[] = [];
  modalLoading = false;
  modalPage = 0;
  modalPageSize = 10;
  modalTotalPages = 0;
  modalTotalElements = 0;
  selectedTradeId: number | null = null;

  // =====================================================
  // �📊 STATISTIQUES HERO SECTION
  // =====================================================
  heroStats = {
    artisansCount: 0,
    clientsCount: 0
  };

  constructor(
    private utilisateurService: UtilisateurService,
    private signupService: SignupService,
    private alerteService: SwettAlerteService,
    private gestionMetierService: GestionMetierService
  ) { }

  ngOnInit() {
    this.loadTopArtisans();
    this.loadAllArtisans(); // Charger les artisans pour la modal en background
    this.loadHeroStats();   // Charger les stats pour la section Hero
  }

  ngOnDestroy() {
    // Cleanup logic
  }

  // =====================================================
  // 📊 CHARGEMENT DES MEILLEURS ARTISANS
  // =====================================================
  /**
   * Charge et trie les 4 meilleurs artis Par averageRating (desc), puis par ratingCount (desc)
   */
  loadTopArtisans(): void {
    this.loadingArtisans = true;
    this.artisansError = false;

    // Charger un grand nombre d'artisans pour assurer d'avoir les meilleurs
    this.utilisateurService.searchArtisans(0, 50).subscribe({
      next: (response) => {
        // Trier par averageRating (desc), puis par ratingCount (desc)
        // Note: ratingCount est retourné par l'API mais pas dans le type User
        const sorted = response.content.sort((a, b) => {
          if (b.averageRating !== a.averageRating) {
            return b.averageRating - a.averageRating;
          }
          // Fallback sur ratingCount si disponible
          const aRatingCount = (a as any).ratingCount || 0;
          const bRatingCount = (b as any).ratingCount || 0;
          return bRatingCount - aRatingCount;
        });

        // Prendre les 4 premiers
        this.topArtisans = sorted.slice(0, 4);
        this.loadingArtisans = false;
      },
      error: (err) => {
        console.error('❌ Erreur chargement artisans:', err);
        this.artisansError = true;
        this.loadingArtisans = false;
      }
    });
  }

  /**
   * Charge une liste plus large d'artisans pour la recherche dans la modal
   */
  loadAllArtisans(): void {
    // On charge une centaine d'artisans pour la recherche client-side
    // Idéalement, la recherche devrait être server-side si beaucoup de données
    this.utilisateurService.searchArtisans(0, 100).subscribe({
      next: (response) => {
        this.allArtisans = response.content;
      },
      error: (err) => {
        console.error('❌ Erreur chargement all artisans:', err);
      }
    });
  }

  /**
   * Charge les statistiques pour la section Hero (nombre d'artisans et clients)
   */
  loadHeroStats(): void {
    this.utilisateurService.getUsersProfilesDistribution().subscribe({
      next: (distribution) => {
        // Chercher les profils ARTISAN et CLIENT dans la distribution
        distribution.forEach(item => {
          if (item.profile === 'ARTISAN') {
            this.heroStats.artisansCount = item.count || 0;
          } else if (item.profile === 'CLIENT') {
            this.heroStats.clientsCount = item.count || 0;
          }
        });
      },
      error: (err) => {
        console.error('❌ Erreur chargement stats Hero:', err);
      }
    });
  }

  // =====================================================
  // 🖼️ HELPERS PHOTO & INITIALES (REPRODUIT DE detail.component.ts)
  // =====================================================
  /**
   * Récupère l'URL complète de la photo d'un artisan
   * Reproduit exactement la logique de detail.component.ts (lignes 566-577)
   */
  getArtisanPhotoUrl(artisan: User): string | null {
    if (!artisan?.photo) return null;
    // Si l'URL est déjà complète (commence par http), la retourner telle quelle
    if (artisan.photo.startsWith('http')) {
      return artisan.photo;
    }
    // Sinon, construire l'URL complète avec le baseUrl de l'API
    return `${environment.imageUrl}/${artisan.photo}`;
  }

  /**
   * Génère les initiales d'un artisan pour le fallback
   * Reproduit exactement la logique de detail.component.ts (lignes 579-584)
   */
  getArtisanInitials(artisan: User): string {
    if (!artisan) return '';
    const firstInitial = artisan.prenom?.charAt(0)?.toUpperCase() || '';
    const lastInitial = artisan.nom?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  }

  /**
   * Récupère le nom du métier de l'artisan
   */
  getTradeName(artisan: User): string {
    return artisan.trade?.name || 'Artisan';
  }

  /**
   * Formatte le numéro de téléphone
   */
  getFormattedPhone(artisan: User): string {
    return artisan.telephone || '';
  }

  /**
   * Vérifie si l'artisan a un badge actif
   * Note: activeBadge est retourné par l'API mais pas dans le type User
   */
  hasActiveBadge(artisan: User): boolean {
    return !!(artisan as any).activeBadge;
  }

  // =====================================================
  // 🔄 NAVIGATION
  // =====================================================
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.mobileMenuOpen = false;
    }
  }

  // =====================================================
  // 📋 MODAL ARTISANS
  // =====================================================
  openArtisansModal() {
    this.showArtisansModal = true;
    this.resetModalState();
    this.loadModalArtisans();
    this.loadTrades(); // Load trades for filter chips
    document.body.style.overflow = 'hidden';
  }

  closeArtisansModal() {
    this.showArtisansModal = false;
    this.searchQuery = '';
    this.selectedTradeId = null;
    document.body.style.overflow = 'auto';
  }

  /**
   * Reset modal state
   */
  resetModalState() {
    this.modalPage = 0;
    this.searchQuery = '';
    this.selectedTradeId = null;
  }

  /**
   * Load artisans for modal with pagination
   */
  loadModalArtisans() {
    this.modalLoading = true;

    this.utilisateurService.searchArtisans(this.modalPage, this.modalPageSize).subscribe({
      next: (response) => {
        this.modalArtisans = response.content || [];
        this.modalTotalPages = response.totalPages;
        this.modalTotalElements = response.totalElements;
        this.modalLoading = false;
      },
      error: (err) => {
        console.error('❌ Erreur chargement artisans modal:', err);
        this.modalLoading = false;
      }
    });
  }

  /**
   * Filter by trade
   */
  filterByTrade(tradeId: number | null) {
    this.selectedTradeId = tradeId;
    this.searchQuery = '';
  }

  /**
   * Reset all filters and reload
   */
  resetFilters() {
    this.searchQuery = '';
    this.selectedTradeId = null;
    this.modalPage = 0;
    this.loadModalArtisans();
  }

  /**
   * Pagination: next page
   */
  nextModalPage() {
    if (this.modalPage < this.modalTotalPages - 1) {
      this.modalPage++;
      this.loadModalArtisans();
    }
  }

  /**
   * Pagination: previous page
   */
  prevModalPage() {
    if (this.modalPage > 0) {
      this.modalPage--;
      this.loadModalArtisans();
    }
  }

  /**
   * Filtered artisans for display
   * - Filters locally by searchQuery and selectedTradeId
   * - If no filter, returns all modalArtisans
   */
  get filteredArtisans(): User[] {
    let result = this.modalArtisans;

    // Filter by trade if selected
    if (this.selectedTradeId !== null) {
      result = result.filter(a => a.trade?.id === this.selectedTradeId);
    }

    // Filter by search query if present
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(artisan =>
        (artisan.trade?.name || '').toLowerCase().includes(query) ||
        (artisan.prenom || '').toLowerCase().includes(query) ||
        (artisan.nom || '').toLowerCase().includes(query) ||
        (artisan.telephone || '').includes(query) ||
        (artisan.adress || '').toLowerCase().includes(query)
      );
    }

    return result;
  }

  // =====================================================
  // ⭐ HELPERS ÉTOILES (avec support partiel)
  // =====================================================
  /**
   * Génère un tableau d'étoiles pour l'affichage avec support des étoiles partielles
   * @param rating Note de 0 à 5 (déjà sur 5)
   * @returns Tableau de 5 étoiles avec leur type et pourcentage de remplissage
   */
  getStars(rating: number): Star[] {
    const scoreOn5 = rating || 0;
    const fullStars = Math.floor(scoreOn5);
    const partialFill = scoreOn5 - fullStars;

    const stars: Star[] = [];

    // Étoiles pleines
    for (let i = 0; i < fullStars; i++) {
      stars.push({ type: 'full' });
    }

    // Étoile partielle (si le reste est > 0)
    if (partialFill > 0 && fullStars < 5) {
      stars.push({
        type: 'partial',
        fillPercentage: partialFill * 100
      });
    }

    // Étoiles vides
    while (stars.length < 5) {
      stars.push({ type: 'empty' });
    }

    return stars;
  }

  /**
   * Formate la note pour l'affichage (max 1 décimale)
   * ex: 4.8333 -> 4.8
   * ex: 4.0 -> 4
   */
  formatRating(rating: number | undefined | null): string | number {
    if (!rating) return 0;
    // Arrondir à 1 décimale
    return Math.round(rating * 10) / 10;
  }

  // =====================================================
  // 📞 CONTACT
  // =====================================================
  contactPhone(artisan: User) {
    if (artisan.telephone) {
      window.location.href = `tel:${artisan.telephone}`;
    }
  }

  contactEmail(artisan: User) {
    if (artisan.email) {
      window.location.href = `mailto:${artisan.email}`;
    }
  }

  // =====================================================
  // 📝 INSCRIPTION ARTISAN (FONCTIONNEL)
  // =====================================================
  showRegisterModal = false;
  showSuccessModal = false;
  showDownloadModal = false;
  showRegisterPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;

  // Trades data (typed + cached)
  trades: Metiers[] = [];
  loadingTrades = false;
  tradesError = false;

  // Modèle du formulaire d'inscription
  registerForm = {
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adress: '',
    password: '',
    confirmPassword: '',
    profil: 'ARTISAN',
    tradeId: null as number | null
  };

  // Profils disponibles
  profilOptions = [
    { value: 'ARTISAN', label: 'Artisan' },
    { value: 'CLIENT', label: 'Client' }
  ];



  openRegisterModal() {
    this.showRegisterModal = true;
    this.resetRegisterForm();
    this.loadTrades();
    document.body.style.overflow = 'hidden';
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
    document.body.style.overflow = 'auto';
  }

  toggleRegisterPassword() {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  resetRegisterForm() {
    this.registerForm = {
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      adress: '',
      password: '',
      confirmPassword: '',
      profil: 'ARTISAN',
      tradeId: null
    };
    this.isSubmitting = false;
  }

  isRegisterFormValid(): boolean {
    const f = this.registerForm;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const basicValid = (
      f.prenom.trim().length >= 2 &&
      f.nom.trim().length >= 2 &&
      emailRegex.test(f.email) &&
      f.telephone.trim().length >= 6 &&
      f.adress.trim().length >= 3 &&
      f.password.length >= 6 &&
      f.confirmPassword.length >= 6 &&
      this.passwordsMatch() &&
      !!f.profil
    );

    // If ARTISAN, tradeId is required
    if (f.profil === 'ARTISAN') {
      return basicValid && f.tradeId !== null;
    }

    return basicValid;
  }

  /**
   * Load trades from API for dropdown (with caching)
   * Uses /api/trades endpoint
   * Fallback: uses static trades if API requires auth (403)
   */
  loadTrades(): void {
    // Cache: don't reload if already loaded
    if (this.trades.length > 0) {
      return;
    }

    this.loadingTrades = true;
    this.tradesError = false;

    this.gestionMetierService.getTrades(0, 100).subscribe({
      next: (response) => {
        this.trades = response.content || [];
        this.loadingTrades = false;
        console.log(`✅ ${this.trades.length} métiers chargés`);
      },
      error: () => {
        // API requires auth (403) - using fallback static trades
        console.warn('⚠️ API /trades requires auth - using fallback data');
        this.loadingTrades = false;

        // Fallback: use static trades if API requires auth (403)
        this.trades = [
          { id: 1, name: 'Électriciens', img: '', description: '' },
          { id: 18, name: 'Plombiers', img: '', description: '' },
          { id: 19, name: 'Menuisiers', img: '', description: '' },
          { id: 20, name: 'Mécaniciens', img: '', description: '' }
        ];
        console.log('⚠️ Fallback: trades statiques utilisés');
      }
    });
  }

  /**
   * Retry loading trades after error
   */
  retryLoadTrades(): void {
    this.trades = []; // Clear cache to force reload
    this.loadTrades();
  }

  /**
   * Check if passwords match
   */
  passwordsMatch(): boolean {
    return this.registerForm.password === this.registerForm.confirmPassword;
  }

  /**
   * Check if trade field should be shown
   */
  shouldShowTradeField(): boolean {
    return this.registerForm.profil === 'ARTISAN';
  }

  submitRegister() {
    if (!this.isRegisterFormValid() || this.isSubmitting) return;

    this.isSubmitting = true;

    const payload: any = {
      nom: this.registerForm.nom.trim(),
      prenom: this.registerForm.prenom.trim(),
      email: this.registerForm.email.trim().toLowerCase(),
      telephone: this.registerForm.telephone.trim(),
      adress: this.registerForm.adress.trim(),
      password: this.registerForm.password,
      profil: this.registerForm.profil,
      // Champs requis par l'API avec valeurs par défaut
      lat: 0,
      lon: 0,
      description: ''
    };

    // Add tradeId only if ARTISAN and selected
    if (this.registerForm.profil === 'ARTISAN' && this.registerForm.tradeId) {
      payload.tradeId = this.registerForm.tradeId;
    }

    this.signupService.signup(payload as any).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.closeRegisterModal();
        this.alerteService.success('Votre compte a été créé avec succès !', 'light');
        // Après un délai, ouvrir le modal de téléchargement
        setTimeout(() => {
          this.showDownloadModal = true;
          document.body.style.overflow = 'hidden';
        }, 1800);
      },
      error: (err) => {
        this.isSubmitting = false;
        // Debug: afficher l'erreur complète dans la console
        console.error('❌ Erreur signup:', err);
        console.error('❌ Erreur body:', err.error);
        console.error('❌ Payload envoyé:', payload);

        const errorMsg = err.error?.message || err.error?.error || 'Une erreur est survenue. Veuillez réessayer.';
        this.alerteService.error(errorMsg, 'light');
      }
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    setTimeout(() => {
      this.showDownloadModal = true;
      document.body.style.overflow = 'hidden';
    }, 300);
  }

  closeDownloadModal() {
    this.showDownloadModal = false;
    document.body.style.overflow = 'auto';
  }
}
