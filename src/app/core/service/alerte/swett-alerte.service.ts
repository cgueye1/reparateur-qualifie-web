import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwettAlerteService {

  success(message: string) {
    Swal.fire({
      icon: 'success',
      text: message,
      timer: 1600,
      showConfirmButton: false,
      background: '#000',
      color: '#FFFFFFCC',
      iconColor: '#E95F32',
      customClass: {
        popup: 'rounded-xl border border-[#FFFFFF33] small-icon',
        htmlContainer: 'text-xs'
      }
    });
  }

  error(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: message,
      background: '#000',
      color: '#FFFFFFCC',
      iconColor: '#E95F32',
      confirmButtonColor: '#E95F32',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'rounded-xl border border-[#FFFFFF33] small-icon',
        title: 'text-sm font-medium',
        htmlContainer: 'text-xs'
      }
    });
  }

  unauthorized() {
    this.error('Vous devez être connecté');
  }

  confirm(message: string, confirmText = 'Confirmer'): Promise<boolean> {
    return Swal.fire({
      icon: 'warning',
      text: message,
      showCancelButton: true,
      background: '#000',
      color: '#FFFFFFCC',
      iconColor: '#E95F32',
      confirmButtonColor: '#E95F32',
      cancelButtonColor: '#FFFFFF33',
      confirmButtonText: confirmText,
      cancelButtonText: 'Annuler',
      customClass: {
        popup: 'rounded-xl border border-[#FFFFFF33] small-icon',
        htmlContainer: 'text-xs'
      }
    }).then(result => result.isConfirmed);
  }
}

