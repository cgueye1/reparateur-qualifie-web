import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirst',
  standalone: false
})
export class CapitalizeFirstPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }

    const normalized = String(value).toLowerCase().trim();
    if (!normalized) {
      return '';
    }

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }
}


