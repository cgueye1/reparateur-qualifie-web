import { Component, HostListener } from '@angular/core';
import { SidebarComponent } from "../../sidebar/sidebar/sidebar.component";
import { TopbarComponent } from "../../topbar/topbar/topbar.component";
import { RouterOutlet } from '@angular/router';
import { ServiceTopbarSidebarService } from '../../../core/service/service-topbar-sidebar.service';

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

  constructor(private ServiceTopbarSidebarService: ServiceTopbarSidebarService) {
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

  // Seulement au moment du changement de mode
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
}
