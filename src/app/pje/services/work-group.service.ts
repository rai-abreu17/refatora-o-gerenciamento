import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface WorkGroup {
  id: number;
  nome: string;
  origem: string;
  qtdMembros: number;
  createdAt: string;
}

export interface WorkGroupMember {
  id: number;
  cpf: string;
  nome: string;
  origem: string;
  grupoTrabalho: string;
  dataDesligamento: string;
}

const INITIAL_GROUPS: WorkGroup[] = [
  { id: 1, nome: 'Equipe PJe 1G - São Luís', origem: 'TRE-MA', qtdMembros: 5, createdAt: '2025-01-15' },
  { id: 2, nome: 'Equipe PJe 2G - Tribunal Pleno', origem: 'TRE-MA', qtdMembros: 4, createdAt: '2025-03-01' },
  { id: 3, nome: 'Suporte Técnico PJe', origem: 'TRE-MA', qtdMembros: 3, createdAt: '2025-06-10' },
  { id: 4, nome: 'Administradores PJe', origem: 'TSE', qtdMembros: 2, createdAt: '2025-08-20' },
  { id: 5, nome: 'Equipe de Implantação', origem: 'TRE-MA', qtdMembros: 3, createdAt: '2025-11-05' }
];

const INITIAL_MEMBERS: { [groupId: number]: WorkGroupMember[] } = {
  1: [
    { id: 1, cpf: '12345678909', nome: 'Ana Carolina Silva Mendes', origem: 'TRE-MA', grupoTrabalho: 'Equipe PJe 1G - São Luís', dataDesligamento: '' },
    { id: 2, cpf: '44455566677', nome: 'Marcos Antônio Barros Filho', origem: 'TRE-MA', grupoTrabalho: 'Equipe PJe 1G - São Luís', dataDesligamento: '' },
    { id: 3, cpf: '55566677788', nome: 'José Ricardo Almeida Pereira', origem: 'TRE-MA', grupoTrabalho: 'Equipe PJe 1G - São Luís', dataDesligamento: '' },
    { id: 4, cpf: '88899900011', nome: 'Camila Rodrigues Teixeira', origem: 'TRE-MA', grupoTrabalho: 'Equipe PJe 1G - São Luís', dataDesligamento: '' },
    { id: 5, cpf: '10020030040', nome: 'Pedro Lucas Martins Souza', origem: 'TSE', grupoTrabalho: 'Equipe PJe 1G - São Luís', dataDesligamento: '' }
  ],
  2: [
    { id: 6, cpf: '98765432100', nome: 'Carlos Eduardo Ribeiro Santos', origem: 'TRE-MA', grupoTrabalho: 'Equipe PJe 2G - Tribunal Pleno', dataDesligamento: '' },
    { id: 7, cpf: '22233344455', nome: 'Roberto Figueiredo Campos', origem: 'TRE-MA', grupoTrabalho: 'Equipe PJe 2G - Tribunal Pleno', dataDesligamento: '' },
    { id: 8, cpf: '66677788899', nome: 'Juliana Cristina Moreira', origem: 'TRE-MA', grupoTrabalho: 'Equipe PJe 2G - Tribunal Pleno', dataDesligamento: '' },
    { id: 9, cpf: '30040050060', nome: 'Thiago Augusto Barbosa Neto', origem: 'TRE-MA', grupoTrabalho: 'Equipe PJe 2G - Tribunal Pleno', dataDesligamento: '' }
  ],
  3: [
    { id: 10, cpf: '55566677788', nome: 'José Ricardo Almeida Pereira', origem: 'TRE-MA', grupoTrabalho: 'Suporte Técnico PJe', dataDesligamento: '' },
    { id: 11, cpf: '77788899900', nome: 'Rafael Henrique Cunha Lima', origem: 'TRE-MA', grupoTrabalho: 'Suporte Técnico PJe', dataDesligamento: '' },
    { id: 12, cpf: '88899900011', nome: 'Camila Rodrigues Teixeira', origem: 'TRE-MA', grupoTrabalho: 'Suporte Técnico PJe', dataDesligamento: '' }
  ],
  4: [
    { id: 13, cpf: '55566677788', nome: 'José Ricardo Almeida Pereira', origem: 'TRE-MA', grupoTrabalho: 'Administradores PJe', dataDesligamento: '' },
    { id: 14, cpf: '30040050060', nome: 'Thiago Augusto Barbosa Neto', origem: 'TRE-MA', grupoTrabalho: 'Administradores PJe', dataDesligamento: '' }
  ],
  5: [
    { id: 15, cpf: '33344455566', nome: 'Fernanda Beatriz Sousa Ramos', origem: 'CNJ', grupoTrabalho: 'Equipe de Implantação', dataDesligamento: '' },
    { id: 16, cpf: '77788899900', nome: 'Rafael Henrique Cunha Lima', origem: 'TRE-MA', grupoTrabalho: 'Equipe de Implantação', dataDesligamento: '' },
    { id: 17, cpf: '40050060070', nome: 'Larissa Vieira de Araújo', origem: 'TRE-MA', grupoTrabalho: 'Equipe de Implantação', dataDesligamento: '' }
  ]
};

@Injectable({ providedIn: 'root' })
export class WorkGroupService {
  private groups: WorkGroup[] = [...INITIAL_GROUPS];
  private members: { [groupId: number]: WorkGroupMember[] } = JSON.parse(JSON.stringify(INITIAL_MEMBERS));
  private nextGroupId = 6;
  private nextMemberId = 18;

  getGroups(): Observable<WorkGroup[]> {
    return of([...this.groups]).pipe(delay(300));
  }

  createGroup(group: Omit<WorkGroup, 'id' | 'qtdMembros' | 'createdAt'>): Observable<WorkGroup> {
    const newGroup: WorkGroup = {
      ...group,
      id: this.nextGroupId++,
      qtdMembros: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.groups.push(newGroup);
    this.members[newGroup.id] = [];
    return of(newGroup).pipe(delay(300));
  }

  updateGroup(id: number, group: Partial<WorkGroup>): Observable<WorkGroup> {
    const idx = this.groups.findIndex(g => g.id === id);
    if (idx >= 0) {
      this.groups[idx] = { ...this.groups[idx], ...group };
      return of(this.groups[idx]).pipe(delay(300));
    }
    return of(null as any).pipe(delay(300));
  }

  deleteGroup(id: number): Observable<boolean> {
    const idx = this.groups.findIndex(g => g.id === id);
    if (idx >= 0) {
      this.groups.splice(idx, 1);
      delete this.members[id];
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  getMembers(groupId: number): Observable<WorkGroupMember[]> {
    return of(this.members[groupId] || []).pipe(delay(200));
  }

  addMember(groupId: number, member: Omit<WorkGroupMember, 'id'>): Observable<WorkGroupMember> {
    const newMember: WorkGroupMember = { ...member, id: this.nextMemberId++ };
    if (!this.members[groupId]) this.members[groupId] = [];
    this.members[groupId].push(newMember);
    const group = this.groups.find(g => g.id === groupId);
    if (group) group.qtdMembros = this.members[groupId].length;
    return of(newMember).pipe(delay(300));
  }

  removeMember(groupId: number, memberId: number): Observable<boolean> {
    const list = this.members[groupId];
    if (list) {
      const idx = list.findIndex(m => m.id === memberId);
      if (idx >= 0) {
        list.splice(idx, 1);
        const group = this.groups.find(g => g.id === groupId);
        if (group) group.qtdMembros = list.length;
        return of(true).pipe(delay(300));
      }
    }
    return of(false).pipe(delay(300));
  }
}
