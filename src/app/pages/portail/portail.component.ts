import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Artisan {
  id: number;
  firstName: string;
  lastName: string;
  profession: string;
  phone: string;
  email: string;
  whatsapp: string;
  avatar: string;
  averageRating: number;
  specialties: string[];
  verified: boolean;
}


@Component({
    selector: 'app-portail',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './portail.component.html',
    styleUrl: './portail.component.css'
})
export class PortailComponent {
    mobileMenuOpen = false;
    showArtisansModal = false;
    searchQuery = '';

    
    

  // Mock data - Artisans
  artisans: Artisan[] = [
    {
      id: 1,
      firstName: 'Mamadou',
      lastName: 'Diop',
      profession: 'Plombier',
      phone: '+221 77 123 45 67',
      email: 'mamadou.diop@example.com',
      whatsapp: '+221771234567',
      avatar: 'assets/artisans/avatar-1.jpg',
      averageRating: 4.8,
      specialties: ['Installation sanitaire', 'Dépannage'],
      verified: true
    },
    {
      id: 2,
      firstName: 'Fatou',
      lastName: 'Seck',
      profession: 'Électricien',
      phone: '+221 77 234 56 78',
      email: 'fatou.seck@example.com',
      whatsapp: '+221772345678',
      avatar: 'assets/artisans/avatar-2.jpg',
      averageRating: 4.9,
      specialties: ['Installation électrique', 'Maintenance'],
      verified: true
    },
    {
      id: 3,
      firstName: 'Ibrahima',
      lastName: 'Fall',
      profession: 'Menuisier',
      phone: '+221 77 345 67 89',
      email: 'ibrahima.fall@example.com',
      whatsapp: '+221773456789',
      avatar: 'assets/artisans/avatar-3.jpg',
      averageRating: 4.7,
      specialties: ['Meubles sur mesure', 'Réparation'],
      verified: true
    },
    {
      id: 4,
      firstName: 'Awa',
      lastName: 'Ndiaye',
      profession: 'Peintre',
      phone: '+221 77 456 78 90',
      email: 'awa.ndiaye@example.com',
      whatsapp: '+221774567890',
      avatar: 'assets/artisans/avatar-4.jpg',
      averageRating: 4.6,
      specialties: ['Peinture intérieure', 'Décoration'],
      verified: true
    },
    {
      id: 5,
      firstName: 'Cheikh',
      lastName: 'Sy',
      profession: 'Maçon',
      phone: '+221 77 567 89 01',
      email: 'cheikh.sy@example.com',
      whatsapp: '+221775678901',
      avatar: 'assets/artisans/avatar-5.jpg',
      averageRating: 4.8,
      specialties: ['Construction', 'Rénovation'],
      verified: true
    },
    {
      id: 6,
      firstName: 'Aminata',
      lastName: 'Ba',
      profession: 'Couturière',
      phone: '+221 77 678 90 12',
      email: 'aminata.ba@example.com',
      whatsapp: '+221776789012',
      avatar: 'assets/artisans/avatar-6.jpg',
      averageRating: 4.9,
      specialties: ['Couture traditionnelle', 'Retouches'],
      verified: true
    }
  ];

  ngOnInit() {
    // Initialization logic
  }

  ngOnDestroy() {
    // Cleanup logic
  }

  scrollToSection(sectionId: string): void {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.mobileMenuOpen = false;
        }
    }

  // Artisans Modal
  openArtisansModal() {
    this.showArtisansModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeArtisansModal() {
    this.showArtisansModal = false;
    this.searchQuery = '';
    document.body.style.overflow = 'auto';
  }

  get featuredArtisans() {
    return this.artisans.slice(0, 4);
  }

  get filteredArtisans() {
    if (!this.searchQuery.trim()) {
      return this.artisans;
    }
    const query = this.searchQuery.toLowerCase();
    return this.artisans.filter(artisan =>
      artisan.profession.toLowerCase().includes(query) ||
      artisan.firstName.toLowerCase().includes(query) ||
      artisan.lastName.toLowerCase().includes(query)
    );
  }

  getStarsArray(rating: number): boolean[] {
    const stars: boolean[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.round(rating));
    }
    return stars;
  }

  contactWhatsApp(artisan: Artisan) {
    window.open(`https://wa.me/${artisan.whatsapp}`, '_blank');
  }

  contactEmail(artisan: Artisan) {
    window.location.href = `mailto:${artisan.email}`;
  }

  contactPhone(artisan: Artisan) {
    window.location.href = `tel:${artisan.phone}`;
  }
}
