
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ServiceTopbarSidebarService } from '../../../core/service/service-topbar-sidebar.service';
import { filter } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
// ✅ Déclarations
  menuOpen = false;
  pageTitle: string = 'Tableau de bord';
  showLogoutPopup = false;

  // ✅ Un seul constructeur propre
  constructor(
    private router: Router,
    private ServiceTopbarSidebarService :ServiceTopbarSidebarService
  ) {}

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
}
