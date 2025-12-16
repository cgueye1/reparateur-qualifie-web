import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';

import { Metiers } from '../../../models/pages/gestion-metier/gestion-metier';
import { GestionMetierService } from '../../../core/service/pages/gestion-metier/gestion-metier.service';
import { SwettAlerteService } from '../../../core/service/alerte/swett-alerte.service';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-gestion-metiers',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, NgIf],
  templateUrl: './gestion-metiers.component.html',
  styleUrl: './gestion-metiers.component.css',
})
export class GestionMetiersComponent {
  // ================================
  // PAGINATION
  // ================================
  page = 0;
  size = 10;

  totalPages = 0;
  totalElements = 0;

  nextPage() {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadMetiers();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadMetiers();
    }
  }

  goToPage(p: number) {
    this.page = p;
    this.loadMetiers();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  onSizeChange() {
    this.page = 0;
    this.loadMetiers();
  }

  get startIndex(): number {
    return this.page * this.size + 1;
  }

  get endIndex(): number {
    return Math.min((this.page + 1) * this.size, this.totalElements);
  }

  /* ============================================================
   * 📌 1 — LISTE DES MÉTIERS
   * ============================================================*/

  metiers: Metiers[] = [];
  searchTerm = '';
  loading = false;

  constructor(
  private metierService: GestionMetierService,
  private alertService: SwettAlerteService
) {}


  ngOnInit(): void {
    this.loadMetiers();
  }

  loadMetiers() {
    this.loading = true;

    this.metierService.getTrades(this.page, this.size).subscribe({
      next: (res) => {
        this.metiers = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement métiers ❌', err);
        this.loading = false;
      },
    });
  }

  get filteredMetiers() {
    return this.metiers.filter((m) =>
      m.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

 /* ============================================================
 * 🗑️ 2 — SUPPRESSION D’UN MÉTIER
 * ============================================================*/

showDeletePopup = false;
selectedMetier: any = null;

/** OUVRIR POPUP DE CONFIRMATION */
openDeletePopup(metier: any) {
  this.selectedMetier = metier;
  this.showDeletePopup = true;
}

/** FERMER POPUP */
closeDelete() {
  this.showDeletePopup = false;
  this.selectedMetier = null;
}

/** CONFIRMER SUPPRESSION */
confirmDelete() {
  if (!this.selectedMetier?.id) {
    this.alertService.error('Métier invalide');
    return;
  }

  this.metierService.deleteTrade(this.selectedMetier.id).subscribe({
    next: () => {
      // ✅ Succès
      this.alertService.success('Métier supprimé avec succès', 'light');

      // 🔄 Rafraîchir la liste
      this.loadMetiers();

      // 🧹 Reset
      this.closeDelete();
    },
    error: (err) => {
      console.error('Erreur suppression métier ❌', err);
      this.alertService.error(
        "Une erreur s'est produite lors de la suppression du métier"
      );
    },
  });
}


  /* ============================================================
   * ➕ 3 — CRÉATION D’UN MÉTIER
   * ============================================================*/

  showCreatePopup = false;
  showSuccessCreate = false;

  selectedFileName = '';
  newFile: File | null = null;

  newMetier = {
    nom: '',
    icon: '',
    description: '',
    image: '',
  };

  openCreatePopup() {
    this.showCreatePopup = true;
  }

  closeCreatePopup() {
    this.showCreatePopup = false;
    this.selectedFileName = '';
    this.newFile = null;
    this.newMetier = { nom: '', icon: '', description: '', image: '' };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFileName = file?.name || '';

    if (file) {
      this.newFile = file;
      this.newMetier.image = URL.createObjectURL(file);
    }
  }

  saveNewMetier() {
  // ❌ ANCIEN CODE (désactivé)
  /*
  this.showCreatePopup = false;
  this.showSuccessCreate = true;
  setTimeout(() => (this.showSuccessCreate = false), 1500);
  this.closeCreatePopup();
  */

  const payload = {
    name: this.newMetier.nom,
    description: this.newMetier.description,
  };

  this.metierService.addTrade(payload, this.newFile || undefined).subscribe({
    next: () => {
      this.showCreatePopup = false;

      // ❌ popup succès interne désactivé
      // this.showSuccessCreate = true;

      // ✅ SweetAlert succès
      this.alertService.success('Métier créé avec succès','light');

      // 🔄 rafraîchir la liste
      this.loadMetiers();

      this.closeCreatePopup();
    },
    error: (err) => {
      console.error('Erreur création métier ❌', err);

      // ✅ SweetAlert erreur
      this.alertService.error(
        "Une erreur s'est produite lors de la création du métier" , 'light'
      );
    },
  });
}


  /* ============================================================
 * ✏️ 4 — MODIFICATION D’UN MÉTIER
 * ============================================================*/

showEditPopup = false;
// showSuccessEdit = false; // ❌ désactivé (SweetAlert utilisé à la place)

editMetier: any = {};
originalEditIndex: number = -1;

editSelectedFileName: string = '';
editSelectedFileSize: string = '';
editFile: File | null = null;

/** Vérifie si c’est une URL */
isUrl(text: string): boolean {
  return /^https?:\/\//.test(text);
}

/** Extraire le nom du fichier depuis une URL */
filenameFromUrl(url: string): string {
  if (!url) return '';
  return url.split('/').pop() || '';
}

/** Taille factice (image distante) */
fileSizeFromUrl(url: string): string {
  return '';
}

/** OUVERTURE POPUP */
openEditPopup(metier: any) {
  this.originalEditIndex = this.metiers.indexOf(metier);
  this.editMetier = { ...metier };

  this.editSelectedFileName = '';
  this.editSelectedFileSize = '';
  this.editFile = null;

  this.showEditPopup = true;
}

/** FERMETURE POPUP */
closeEditPopup() {
  this.showEditPopup = false;
  this.editMetier = {};
  this.editSelectedFileName = '';
  this.editSelectedFileSize = '';
  this.editFile = null;
  this.originalEditIndex = -1;
}

/** SÉLECTION D’UNE NOUVELLE IMAGE */
onEditFileSelected(event: any) {
  const file: File = event.target.files?.[0];
  if (!file) return;

  this.editFile = file;
  this.editSelectedFileName = file.name;
  this.editSelectedFileSize = Math.round(file.size / 1024) + ' ko';

  this.editMetier.image = URL.createObjectURL(file);
}

/** SUPPRIMER ICÔNE */
removeIcon() {
  this.editMetier.icon = '';
}

/** SUPPRIMER IMAGE */
removeImage() {
  if (this.editFile && this.editMetier.image?.startsWith('blob:')) {
    URL.revokeObjectURL(this.editMetier.image);
  }

  this.editMetier.image = '';
  this.editSelectedFileName = '';
  this.editSelectedFileSize = '';
  this.editFile = null;
}

/** SAUVEGARDE VIA API */
saveEditMetier() {
  const payload = {
    name: this.editMetier.name,          // ✅ CORRECTION CLÉ
    description: this.editMetier.description,
  };

  this.metierService
    .updateTrade(this.editMetier.id, payload, this.editFile || undefined)
    .subscribe({
      next: () => {
        this.alertService.success('Métier modifié avec succès');
        this.loadMetiers();
        this.closeEditPopup();
      },
      error: (err) => {
        console.error('Erreur modification métier ❌', err);
        this.alertService.error(
          "Une erreur s'est produite lors de la modification du métier"
        );
      },
    });
}






getImageUrl(img: string | null): string {
  if (!img) {
    return 'assets/no-image.png';
  }

  // backend retourne juste le nom du fichier
  return `${environment.imageUrl}/${img}`;
}
}
