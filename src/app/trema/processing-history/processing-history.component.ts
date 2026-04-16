import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ToastService } from '../../shared/services/toast.service';
import {
  ProcessingHistoryService,
  ProcessingHistoryRecord,
  ActionMessage,
  ErrorMessage
} from '../services/processing-history.service';
import { MessageDetailPanelComponent } from './components/message-detail-panel/message-detail-panel.component';

@Component({
  selector: 'app-processing-history',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ToastComponent,
    MessageDetailPanelComponent
  ],
  templateUrl: './processing-history.component.html',
  styleUrl: './processing-history.component.scss'
})
export class ProcessingHistoryComponent implements OnInit {
  records = signal<ProcessingHistoryRecord[]>([]);
  totalElements = signal(0);
  currentPage = signal(0);
  pageSize = signal(10);
  loading = signal(false);

  showDetailPanel = signal(false);
  detailTitle = signal('');
  detailMessages = signal<any[]>([]);
  detailLoading = signal(false);

  constructor(
    private historyService: ProcessingHistoryService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading.set(true);
    this.historyService.getHistory(this.currentPage(), this.pageSize()).subscribe({
      next: (result) => {
        this.records.set(result.content);
        this.totalElements.set(result.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.toastService.error('Erro ao carregar histórico de processamento.');
        this.loading.set(false);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadHistory();
  }

  viewActionMessages(record: ProcessingHistoryRecord): void {
    this.detailTitle.set('Mensagem de Ação');
    this.detailLoading.set(true);
    this.showDetailPanel.set(true);
    this.historyService.getActionMessages(record.id).subscribe({
      next: (messages) => {
        this.detailMessages.set(messages);
        this.detailLoading.set(false);
      },
      error: () => {
        this.toastService.error('Erro ao carregar mensagens de ação.');
        this.detailLoading.set(false);
      }
    });
  }

  viewErrorMessages(record: ProcessingHistoryRecord): void {
    this.detailTitle.set('Mensagem de Erro');
    this.detailLoading.set(true);
    this.showDetailPanel.set(true);
    this.historyService.getErrorMessages(record.id).subscribe({
      next: (messages) => {
        this.detailMessages.set(messages);
        this.detailLoading.set(false);
      },
      error: () => {
        this.toastService.error('Erro ao carregar mensagens de erro.');
        this.detailLoading.set(false);
      }
    });
  }

  viewUpdatedUsers(record: ProcessingHistoryRecord): void {
    this.detailTitle.set('Usuários Atualizados');
    this.detailLoading.set(true);
    this.showDetailPanel.set(true);
    this.historyService.getUpdatedUsers(record.id).subscribe({
      next: (messages) => {
        this.detailMessages.set(messages);
        this.detailLoading.set(false);
      },
      error: () => {
        this.toastService.error('Erro ao carregar usuários atualizados.');
        this.detailLoading.set(false);
      }
    });
  }

  closeDetailPanel(): void {
    this.showDetailPanel.set(false);
    this.detailMessages.set([]);
  }

  hasErrors(record: ProcessingHistoryRecord): boolean {
    return record.mensagemErro !== null;
  }

  goBack(): void {
    this.router.navigate(['/trema/management']);
  }

  get totalPages(): number {
    return Math.ceil(this.totalElements() / this.pageSize());
  }
}
