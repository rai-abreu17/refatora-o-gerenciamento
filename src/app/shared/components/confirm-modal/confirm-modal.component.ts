import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent {
  title = input<string>('Confirmar');
  message = input<string>('Tem certeza?');
  confirmLabel = input<string>('OK');
  cancelLabel = input<string>('Cancelar');

  confirmed = output<void>();
  cancelled = output<void>();

  processing = signal(false);

  onConfirm(): void {
    if (this.processing()) return;
    this.processing.set(true);
    this.confirmed.emit();
    setTimeout(() => this.processing.set(false), 1000);
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
