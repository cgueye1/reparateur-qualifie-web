import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';      // ➜ Pour *ngIf, *ngFor, ngClass
import { FormsModule } from '@angular/forms';        // ➜ Pour [(ngModel)]

@Component({
  selector: 'app-publicite',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './publicite.component.html',
  styleUrl: './publicite.component.css'
})
export class PubliciteComponent {

  //-----------------------------------------
  // 🔢 STATISTIQUES DES 3 CARTES
  //-----------------------------------------
  stats = {
    total: 8,
    actives: 5,
    inactives: 3
  };

  //-----------------------------------------
  // 📌 LISTE DES PUBLICITÉS
  //-----------------------------------------
  pubs = [
    {
      id: 1,
      titre: "Promotion Matériaux de Construction",
      description: "Jusqu'à 30% de réduction sur tous les matériaux",
      image: "pub.jpg",
      vues: 1250,
      clics: 87,
      cibles: "Tous",
      taux: 12,
      periode: "Du 01/03/2025 au 01/04/2025",
      active: true
    },
    {
      id: 2,
      titre: "Promotion Matériaux de Construction",
      description: "Jusqu'à 30% de réduction sur tous les matériaux",
      image: "pub1.jpg",
      vues: 1250,
      clics: 87,
      cibles: "Tous",
      taux: 12,
      periode: "Du 01/03/2025 au 01/04/2025",
      active: false
    }
  ];

  //-----------------------------------------
  // 🔍 RECHERCHE
  //-----------------------------------------
  searchText: string = '';

  get filteredPubs() {
    if (!this.searchText.trim()) return this.pubs;
    return this.pubs.filter(p =>
      p.titre.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  //-----------------------------------------
  // 🚦 POPUPS : ACTIVER / DÉSACTIVER
  //-----------------------------------------
  showActivatePopup = false;
  showDeactivatePopup = false;

  showSuccessActivate = false;
  showSuccessDeactivate = false;

  selectedPub: any = null;


  //-----------------------------------------
  // 🟢 OUVERTURE DES POPUPS
  //-----------------------------------------
  openActivatePopup(pub: any) {
    this.selectedPub = pub;
    this.showActivatePopup = true;
  }

  openDeactivatePopup(pub: any) {
    this.selectedPub = pub;
    this.showDeactivatePopup = true;
  }


  //-----------------------------------------
  // 🔴 FERMETURE DES POPUPS
  //-----------------------------------------
  closePopups() {
    this.showActivatePopup = false;
    this.showDeactivatePopup = false;
  }


  //-----------------------------------------
  // 🔵 CONFIRMATION : ACTIVER
  //-----------------------------------------
  confirmActivate() {
    if (this.selectedPub) {
      this.selectedPub.active = true;
    }
    this.closePopups();
    this.showSuccessActivate = true;

    setTimeout(() => {
      this.showSuccessActivate = false;
    }, 2000);
  }

  //-----------------------------------------
  // 🔴 CONFIRMATION : DÉSACTIVER
  //-----------------------------------------
  confirmDeactivate() {
    if (this.selectedPub) {
      this.selectedPub.active = false;
    }
    this.closePopups();
    this.showSuccessDeactivate = true;

    setTimeout(() => {
      this.showSuccessDeactivate = false;
    }, 2000);
  }

  //-----------------------------------------
  // 🔢 PAGINATION
  //-----------------------------------------
  page = 1;
  pageSize = 10;

  get totalPages() {
    return Math.ceil(this.filteredPubs.length / this.pageSize);
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }









  // POPUPS
showCreatePopup = false;
showSuccessCreate = false;

// FORM DATA
pubForm: any = {
  titre: "",
  description: "",
  lien: "",
  dateDebut: "",
  dateFin: "",
  zone: "Tous",
  image: null,
  imageName: ""
};

// Ouvrir popup
openCreatePopup() {
  this.showCreatePopup = true;
}

// Fermer popup
closeCreatePopup() {
  this.showCreatePopup = false;
}

// Fichier sélectionné
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.pubForm.image = file;
    this.pubForm.imageName = file.name;
  }
}

// SUBMIT
submitPub() {
  this.showCreatePopup = false;

  setTimeout(() => {
    this.showSuccessCreate = true;

    setTimeout(() => {
      this.showSuccessCreate = false;
    }, 1500);

  }, 300);
}


}
