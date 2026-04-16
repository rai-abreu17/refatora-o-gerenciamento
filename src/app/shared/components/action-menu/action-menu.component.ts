import { Component, input, output, signal, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ActionItem {
  label: string;
  icon?: string;
  key: string;
}

@Component({
  selector: 'app-action-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-menu.component.html',
  styleUrl: './action-menu.component.scss',
})
export class ActionMenuComponent {
  actions = input.required<ActionItem[]>();
  actionClick = output<string>();

  private elementRef = inject(ElementRef);
  isOpen = signal(false);

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  onAction(key: string): void {
    this.actionClick.emit(key);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
