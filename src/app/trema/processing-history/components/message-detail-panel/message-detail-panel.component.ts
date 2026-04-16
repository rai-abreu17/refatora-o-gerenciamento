import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-detail-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-detail-panel.component.html',
  styleUrl: './message-detail-panel.component.scss'
})
export class MessageDetailPanelComponent {
  @Input() title: string = '';
  @Input() messages: any[] = [];
  @Input() visible: boolean = false;
  @Input() loading: boolean = false;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  isActionMessage(msg: any): boolean {
    return msg.situacaoAnterior !== undefined;
  }

  isErrorMessage(msg: any): boolean {
    return msg.mensagem !== undefined && msg.situacaoAnterior === undefined;
  }
}
