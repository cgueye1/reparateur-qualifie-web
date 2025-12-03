import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceTopbarSidebarService {

private open = new BehaviorSubject<boolean>(true);
  open$ = this.open.asObservable();

  // ouvrir / fermer
  toggle() {
    this.open.next(!this.open.value);
  }

  // forcer la valeur (true / false)
  set(value: boolean) {
    this.open.next(value);
  }

}
