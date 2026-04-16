import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog } from '@angular/material/dialog';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { GroupFormDialogComponent } from './components/group-form/group-form.component';
import { MemberFormDialogComponent } from './components/member-form/member-form.component';

import { WorkGroupService, WorkGroup, WorkGroupMember } from '../services/work-group.service';
import { ToastService } from '../../shared/services/toast.service';
import { formatCpf } from '../../shared/validators/cpf.validator';

@Component({
  selector: 'app-work-groups',
  standalone: true,
  imports: [
    RouterModule, FormsModule,
    MatExpansionModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatChipsModule, MatCardModule,
    MatProgressSpinnerModule, MatTooltipModule, MatBadgeModule,
    PageHeaderComponent,
  ],
  templateUrl: './work-groups.component.html',
  styleUrl: './work-groups.component.scss',
})
export class WorkGroupsComponent implements OnInit {
  private groupService = inject(WorkGroupService);
  private toastService = inject(ToastService);
  private dialog = inject(MatDialog);

  groups = signal<WorkGroup[]>([]);
  loading = signal(false);
  searchTerm = signal('');

  filteredGroups = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.groups();
    return this.groups().filter(g =>
      g.nome.toLowerCase().includes(term) ||
      g.origem.toLowerCase().includes(term) ||
      String(g.id).includes(term)
    );
  });

  expandedGroupId = signal<number | null>(null);
  members = signal<WorkGroupMember[]>([]);
  loadingMembers = signal(false);

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.loading.set(true);
    this.groupService.getGroups().subscribe(groups => {
      this.groups.set(groups);
      this.loading.set(false);
    });
  }

  onPanelOpened(group: WorkGroup): void {
    this.expandedGroupId.set(group.id);
    this.loadMembers(group.id);
  }

  onPanelClosed(group: WorkGroup): void {
    if (this.expandedGroupId() === group.id) {
      this.expandedGroupId.set(null);
      this.members.set([]);
    }
  }

  loadMembers(groupId: number): void {
    this.loadingMembers.set(true);
    this.groupService.getMembers(groupId).subscribe(members => {
      this.members.set(members);
      this.loadingMembers.set(false);
    });
  }

  openCreateGroup(): void {
    const dialogRef = this.dialog.open(GroupFormDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      data: { group: null },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupService.createGroup(result).subscribe(() => {
          this.toastService.success('Grupo criado com sucesso.');
          this.loadGroups();
        });
      }
    });
  }

  openEditGroup(group: WorkGroup): void {
    const dialogRef = this.dialog.open(GroupFormDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      data: { group },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupService.updateGroup(group.id, result).subscribe(() => {
          this.toastService.success('Grupo atualizado com sucesso.');
          this.loadGroups();
        });
      }
    });
  }

  confirmDeleteGroup(group: WorkGroup): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Excluir Grupo',
        message: `Tem certeza que deseja excluir o grupo '${group.nome}'? Este grupo possui ${group.qtdMembros} membro(s).`,
        confirmLabel: 'Excluir',
      },
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.groupService.deleteGroup(group.id).subscribe(success => {
          if (success) {
            this.toastService.success('Grupo excluido com sucesso.');
            if (this.expandedGroupId() === group.id) {
              this.expandedGroupId.set(null);
              this.members.set([]);
            }
          } else {
            this.toastService.error('Erro ao excluir grupo.');
          }
          this.loadGroups();
        });
      }
    });
  }

  openAddMember(groupId: number): void {
    const dialogRef = this.dialog.open(MemberFormDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const group = this.groups().find(g => g.id === groupId);
        this.groupService.addMember(groupId, {
          ...result,
          grupoTrabalho: group?.nome ?? '',
        }).subscribe(() => {
          this.toastService.success('Membro adicionado com sucesso.');
          this.loadMembers(groupId);
          this.loadGroups();
        });
      }
    });
  }

  confirmRemoveMember(groupId: number, member: WorkGroupMember): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Remover Membro',
        message: `Tem certeza que deseja remover ${member.nome} deste grupo?`,
        confirmLabel: 'Remover',
      },
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.groupService.removeMember(groupId, member.id).subscribe(success => {
          if (success) {
            this.toastService.success('Membro removido com sucesso.');
            this.loadMembers(groupId);
            this.loadGroups();
          }
        });
      }
    });
  }

  fmtCpf(cpf: string): string {
    return formatCpf(cpf);
  }

  getInitials(nome: string): string {
    const parts = nome.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}
