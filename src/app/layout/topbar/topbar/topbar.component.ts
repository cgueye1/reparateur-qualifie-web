
import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ServiceTopbarSidebarService } from '../../../core/service/service-topbar-sidebar.service';
import { filter, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../../../core/service/user-state.service';
import { MonCompteService } from '../../../core/service/pages/mon-compte/mon-compte-service.service';
import { UserConnected } from '../../../models/user/userConnected';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent implements OnInit, OnDestroy {
  // ✅ Déclarations
  menuOpen = false;
  pageTitle: string = 'Tableau de bord';
  showLogoutPopup = false;
  user: UserConnected | null = null;
  private userSubscription?: Subscription;

  // ✅ Un seul constructeur propre
  constructor(
    private router: Router,
    private ServiceTopbarSidebarService: ServiceTopbarSidebarService,
    private userStateService: UserStateService,
    private monCompteService: MonCompteService
  ) { }

  // ✅ Lifecycle
  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.router.routerState.root;
        while (route.firstChild) {
          route = route.firstChild;
        }

        const title = route.snapshot.data['title'];
        this.pageTitle = title || '...';
      });

    // S'abonner au flux réactif de l'utilisateur
    this.userSubscription = this.userStateService.currentUser$.subscribe({
      next: (user) => {
        this.user = user;
      }
    });

    // Charger les données initiales si pas encore chargées
    if (!this.userStateService.getUser()) {
      this.loadUser();
    }
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  // ✅ Charger les données de l'utilisateur connecté
  loadUser(): void {
    this.monCompteService.getMonCompte().subscribe({
      next: (data) => {
        this.userStateService.setUser(data);
      },
      error: (err) => {
        console.error('Erreur chargement utilisateur dans topbar', err);
      }
    });
  }

  // ✅ Construire l'URL de la photo de profil
  getPhotoUrl(photo: string | null | undefined): string {
    return this.userStateService.getPhotoUrl(photo);
  }

  // ✅ Obtenir les initiales de l'utilisateur
  getUserInitials(): string {
    return this.userStateService.getUserInitials(this.user);
  }

  // ✅ Méthodes du menu
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleSidebar(): void {
    this.ServiceTopbarSidebarService.toggle();
  }

  // ✅ Méthodes popup logout
  openLogoutPopup(): void {
    this.showLogoutPopup = true;
  }

  closeLogoutPopup(): void {
    this.showLogoutPopup = false;
  }

  confirmLogout(): void {
    this.showLogoutPopup = false;
    window.location.href = '/auth/login';
  }


  @Output() logoutEvent = new EventEmitter<void>(); // ✅ Événement envoyé au parent

  onLogout() {
    this.logoutEvent.emit(); // 🔥 Envoie la demande de déconnexion au MainLayout
  }
}
