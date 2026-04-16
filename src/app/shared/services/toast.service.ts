import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'warning';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private snackBar = inject(MatSnackBar);

  // Legacy BehaviorSubject kept for backward compat (ODIN/TRE-MA still use ToastComponent)
  private _idCounter = 0;
  private _toasts = new BehaviorSubject<ToastMessage[]>([]);
  toasts$ = this._toasts.asObservable();

  success(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 4000,
      panelClass: 'snackbar-success',
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
    this._addLegacy('success', message);
  }

  error(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 6000,
      panelClass: 'snackbar-error',
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
    this._addLegacy('error', message);
  }

  warning(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      panelClass: 'snackbar-warning',
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
    this._addLegacy('warning', message);
  }

  remove(id: number): void {
    this._toasts.next(this._toasts.value.filter((t) => t.id !== id));
  }

  private _addLegacy(type: ToastMessage['type'], message: string): void {
    const id = ++this._idCounter;
    const toast: ToastMessage = { id, type, message };
    this._toasts.next([...this._toasts.value, toast]);
    setTimeout(() => this.remove(id), 5000);
  }
}
