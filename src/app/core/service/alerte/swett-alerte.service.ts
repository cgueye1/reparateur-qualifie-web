import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

export type AlertTheme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class SwettAlerteService {

  /* ===========================
     ✅ SUCCÈS
     =========================== */
  success(message: string, theme: AlertTheme = 'dark') {
    Swal.fire(this.buildConfig({
      icon: 'success',
      message,
      theme,
      autoClose: true
    }));
  }

  /* ===========================
     ❌ ERREUR
     =========================== */
  error(message: string, theme: AlertTheme = 'dark') {
    Swal.fire(this.buildConfig({
      icon: 'error',
      message,
      theme
    }));
  }

  /* ===========================
     🔒 NON AUTHENTIFIÉ
     =========================== */
  unauthorized(theme: AlertTheme = 'dark') {
    this.error('Vous devez être connecté', theme);
  }

  /* ===========================
     ⚠️ CONFIRMATION
     =========================== */
  confirm(
    message: string,
    confirmText = 'Confirmer',
    theme: AlertTheme = 'dark'
  ): Promise<boolean> {

    return Swal.fire({
      ...this.baseStyle(theme),
      icon: 'warning',
      text: message,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#E95F32',
      cancelButtonColor: theme === 'dark' ? '#FFFFFF33' : '#E5E7EB'
    }).then(res => res.isConfirmed);
  }

  /* =================================================
     🔧 MÉTHODES INTERNES
     ================================================= */

  private buildConfig(options: {
    icon: 'success' | 'error';
    message: string;
    theme: AlertTheme;
    autoClose?: boolean;
  }): SweetAlertOptions {

    return {
      ...this.baseStyle(options.theme),
      icon: options.icon,
      text: options.message,
      timer: options.autoClose ? 1600 : undefined,
      showConfirmButton: !options.autoClose,
      confirmButtonColor: '#E95F32'
    };
  }

  private baseStyle(theme: AlertTheme): SweetAlertOptions {
    return {
      background: theme === 'dark' ? '#000' : '#fff',
      color: theme === 'dark' ? '#FFFFFFCC' : '#111',
      iconColor: '#E95F32',
      customClass: {
        popup: `alert-card ${theme === 'dark'
          ? 'border-[#FFFFFF33]'
          : 'border-gray-200'}`,
        title: 'text-sm font-medium',
        htmlContainer: 'text-xs'
      }
    };
  }
}
