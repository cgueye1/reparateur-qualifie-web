import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule, NgFor, NgIf } from "@angular/common";

@Component({
  selector: 'app-gestion-metiers',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, NgIf],
  templateUrl: './gestion-metiers.component.html',
  styleUrl: './gestion-metiers.component.css'
})
export class GestionMetiersComponent {


  /* ============================================================
   * 📌 1 — LISTE DES MÉTIERS
   * ============================================================*/

  metiers = [
    {
      nom: "Plomberie",
      description: "Installation, maintenance et réparation des systèmes de canalisation d'eau.",
      icon: "https://img.icons8.com/ios-glyphs/30/plumbing.png",
      image: "",
      date: "01/12/2025"
    },
    {
      nom: "Électricité",
      description: "Installation, sécurisation, et dépannage des réseaux électriques.",
      icon: "https://img.icons8.com/ios-glyphs/30/electrical.png",
      image: "electricien.jpg",
      date: "29/11/2025"
    },
    {
      nom: "Peinture",
      description: "Préparation des surfaces, application des finitions.",
      icon: "https://img.icons8.com/ios-glyphs/30/paint-roller.png",
      image: "peintre.jpg",
      date: "29/11/2025"
    }
  ];

  searchTerm = "";

  get filteredMetiers() {
    return this.metiers.filter(m =>
      m.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
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

    this.metiers.push({
      ...this.newMetier,
      date: new Date().toLocaleDateString("fr-FR"),
    });

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
