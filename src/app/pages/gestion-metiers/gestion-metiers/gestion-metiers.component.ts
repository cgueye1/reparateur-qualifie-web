import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { GestionMetierService } from '../../../core/service/gestion-metier/gestion-metier.service';
import { Metiers } from '../../../models/gestion-metier/gestion-metier';

@Component({
  selector: 'app-gestion-metiers',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, NgIf],
  templateUrl: './gestion-metiers.component.html',
  styleUrl: './gestion-metiers.component.css'
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
  this.page = 0; // on revient à la première page
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

  /* ==========================
   * 📌 LISTE DES MÉTIERS (API)
   * ========================== */
  metiers: Metiers[] = [];
  searchTerm = '';

  // pagination simple


  loading = false;

  constructor(private metierService: GestionMetierService) {}

  ngOnInit(): void {
    this.loadMetiers();
  }

  loadMetiers() {
  this.loading = true;

  this.metierService.getTrades(this.page, this.size).subscribe({
    next: (res) => {
      this.metiers = res.content;

      // ✅ AJOUTE CES DEUX LIGNES
      this.totalPages = res.totalPages;
      this.totalElements = res.totalElements;

      this.loading = false;
      console.log('Métiers chargés ✅', res);
    },
    error: (err) => {
      console.error('Erreur chargement métiers ❌', err);
      this.loading = false;
    }
  });
}


  get filteredMetiers() {
    return this.metiers.filter(m =>
      m.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }



  /* ============================================================
   * 🗑️ 2 — SUPPRESSION
   * ============================================================*/

  showDeletePopup = false;
  showSuccessDelete = false;
  selectedMetier: any = null;

  openDeletePopup(metier: any) {
    this.selectedMetier = metier;
    this.showDeletePopup = true;
  }

  closeDelete() {
    this.showDeletePopup = false;
  }

  confirmDelete() {
    const index = this.metiers.indexOf(this.selectedMetier);

    if (index > -1) {
      this.metiers.splice(index, 1);
    }

    this.showDeletePopup = false;
    this.showSuccessDelete = true;

    setTimeout(() => this.showSuccessDelete = false, 1500);
  }




  /* ============================================================
   * ➕ 3 — CRÉATION D’UN MÉTIER
   * ============================================================*/

  showCreatePopup = false;
  showSuccessCreate = false;

  selectedFileName = "";
  newFile: File | null = null;

  newMetier = {
    nom: "",
    icon: "",
    description: "",
    image: ""
  };

  openCreatePopup() {
    this.showCreatePopup = true;
  }

  closeCreatePopup() {
    this.showCreatePopup = false;
    this.selectedFileName = "";
    this.newFile = null;
    this.newMetier = { nom: "", icon: "", description: "", image: "" };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFileName = file?.name || "";

    if (file) {
      this.newFile = file;
      this.newMetier.image = URL.createObjectURL(file);
    }
  }

  saveNewMetier() {



    this.showCreatePopup = false;
    this.showSuccessCreate = true;

    setTimeout(() => this.showSuccessCreate = false, 1500);

    this.closeCreatePopup(); // reset propre
  }




  /* ============================================================
   * ✏️ 4 — MODIFICATION D’UN MÉTIER
   * ============================================================*/

  showEditPopup = false;
  showSuccessEdit = false;

  editMetier: any = {};
  originalEditIndex: number = -1;

  editSelectedFileName: string = "";
  editSelectedFileSize: string = "";
  editFile: File | null = null;

  /** Détecter si un texte est une URL valide (pour savoir si on affiche <img>) **/
  isUrl(text: string): boolean {
    return /^https?:\/\//.test(text);
  }

  /** Retourner le nom d’un fichier depuis une URL (image existante dans ton projet) **/
  filenameFromUrl(url: string): string {
    if (!url) return "";
    return url.split('/').pop() || "";
  }

  /** Retourner une taille factice (pas utile si image vient d’un lien) **/
  fileSizeFromUrl(url: string): string {
    return "";
  }


  /** OUVERTURE POPUP MODIFICATION **/
  openEditPopup(metier: any) {
    this.originalEditIndex = this.metiers.indexOf(metier);
    this.editMetier = { ...metier };

    this.editSelectedFileName = "";
    this.editSelectedFileSize = "";
    this.editFile = null;

    this.showEditPopup = true;
  }


  /** FERMER POPUP EDIT **/
  closeEditPopup() {
    this.showEditPopup = false;
    this.editMetier = {};
    this.editSelectedFileName = "";
    this.editSelectedFileSize = "";
    this.editFile = null;
    this.originalEditIndex = -1;
  }


  /** UPLOAD DANS L'ÉDITION **/
  onEditFileSelected(event: any) {
    const file: File = event.target.files?.[0];

    if (!file) return;

    this.editFile = file;
    this.editSelectedFileName = file.name;
    this.editSelectedFileSize = Math.round(file.size / 1024) + "ko";

    this.editMetier.image = URL.createObjectURL(file);
  }


  /** SUPPRIMER ICÔNE **/
  removeIcon() {
    this.editMetier.icon = "";
  }


  /** SUPPRIMER IMAGE **/
  removeImage() {

    if (this.editFile && this.editMetier.image.startsWith("blob:")) {
      URL.revokeObjectURL(this.editMetier.image);
    }

    this.editMetier.image = "";
    this.editSelectedFileName = "";
    this.editSelectedFileSize = "";
    this.editFile = null;
  }


  /** SAUVEGARDE DU MÉTIER MODIFIÉ **/
  saveEditMetier() {

    if (this.originalEditIndex > -1) {

      this.metiers[this.originalEditIndex] = {
        ...this.metiers[this.originalEditIndex],
        ...this.editMetier
      };
    }

    this.showEditPopup = false;
    this.showSuccessEdit = true;

    setTimeout(() => this.showSuccessEdit = false, 1500);

    this.closeEditPopup();
  }


}
