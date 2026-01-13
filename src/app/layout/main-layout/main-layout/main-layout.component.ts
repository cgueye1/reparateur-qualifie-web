import { Component, HostListener } from '@angular/core';
import { SidebarComponent } from "../../sidebar/sidebar/sidebar.component";
import { TopbarComponent } from "../../topbar/topbar/topbar.component";
import { Router, RouterOutlet } from '@angular/router';   // ✅ AJOUT
import { ServiceTopbarSidebarService } from '../../../core/service/service-topbar-sidebar.service';
import { LoginService } from '../../../core/service/auth/login/login.service'; // ✅ AJOUT

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

  sidebarOpen = window.innerWidth >= 768;
  isMobile = window.innerWidth < 768;

  // ✅ AJOUT dans le constructor
  constructor(
    private ServiceTopbarSidebarService: ServiceTopbarSidebarService,
    private router: Router,                  // ajouté
    private loginService: LoginService       // ajouté
  ) {
    this.ServiceTopbarSidebarService.open$.subscribe(value => {
      this.sidebarOpen = value;
    });
  }

  ngOnInit() {
    const isMobile = window.innerWidth < 768;
    this.isMobile = isMobile;
    this.ServiceTopbarSidebarService.set(!isMobile);
  }

  @HostListener('window:resize')
  onResize() {
    const width = window.innerWidth;
    const isNowMobile = width < 768;

    if (isNowMobile !== this.isMobile) {
      if (isNowMobile) {
        this.ServiceTopbarSidebarService.set(false);
      } else {
        this.ServiceTopbarSidebarService.set(true);
      }
    }

    this.isMobile = isNowMobile;
  }

  @HostListener('document:click')
  closeSidebarOnOutsideClick() {
    if (this.isMobile && this.sidebarOpen) {
      this.ServiceTopbarSidebarService.set(false);
    }
  }

  // MÉTHODE LOGOUT
  logout() {
    const auth = localStorage.getItem("rq_auth");

    // Si pas de token → redirection simple
    if (!auth) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // Appel API logout
    this.loginService.logout().subscribe({
      next: () => {
        localStorage.removeItem("rq_auth");
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        // même en cas d'erreur → déconnexion locale
        localStorage.removeItem("rq_auth");
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
