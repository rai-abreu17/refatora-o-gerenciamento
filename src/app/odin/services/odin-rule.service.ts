import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface OdinRule {
  id: number;
  sistema: string;
  categoria: string;
  perfil: string;
  condicoes: string;
  situacao: 'ATIVO' | 'INATIVO';
  createdAt: string;
  updatedAt: string;
}

export interface OdinRulePage {
  content: OdinRule[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

let MOCK_RULES: OdinRule[] = [
  {
    id: 1,
    sistema: 'ODIN',
    categoria: 'Acesso Administrativo',
    perfil: 'Administrador',
    condicoes: 'Usuário deve pertencer à lotação STI e possuir categoriaFuncional = Analista Judiciário',
    situacao: 'ATIVO',
    createdAt: '2025-01-15T10:30:00',
    updatedAt: '2025-06-20T14:22:00'
  },
  {
    id: 2,
    sistema: 'ODIN',
    categoria: 'Acesso Operacional',
    perfil: 'Operador',
    condicoes: 'Usuário deve possuir conta LDAP ativa e lotação em Zona Eleitoral',
    situacao: 'ATIVO',
    createdAt: '2025-02-10T08:15:00',
    updatedAt: '2025-07-01T09:45:00'
  },
  {
    id: 3,
    sistema: 'ODIN',
    categoria: 'Consulta',
    perfil: 'Consultor',
    condicoes: 'Qualquer usuário com situação Ativo e origem LDAP ou Manual',
    situacao: 'ATIVO',
    createdAt: '2025-03-05T11:00:00',
    updatedAt: '2025-05-18T16:30:00'
  },
  {
    id: 4,
    sistema: 'ODIN',
    categoria: 'Gestão de Pessoas',
    perfil: 'Administrador',
    condicoes: 'Usuário lotado na SGP com perfil de chefia registrado no LDAP',
    situacao: 'ATIVO',
    createdAt: '2025-03-20T09:00:00',
    updatedAt: '2025-08-12T11:15:00'
  },
  {
    id: 5,
    sistema: 'ODIN',
    categoria: 'Relatórios',
    perfil: 'Consultor',
    condicoes: 'Usuário com categoriaFuncional diferente de Estagiário e situação Ativo',
    situacao: 'INATIVO',
    createdAt: '2025-04-01T14:20:00',
    updatedAt: '2025-09-05T10:00:00'
  },
  {
    id: 6,
    sistema: 'ODIN',
    categoria: 'Auditoria',
    perfil: 'Administrador',
    condicoes: 'Usuário pertencente à Corregedoria com registro de acesso nos últimos 90 dias',
    situacao: 'ATIVO',
    createdAt: '2025-05-10T07:45:00',
    updatedAt: '2025-10-22T13:40:00'
  },
  {
    id: 7,
    sistema: 'ODIN',
    categoria: 'Comunicação',
    perfil: 'Operador',
    condicoes: 'Usuário lotado na ASCOM com conta LDAP ativa e último login inferior a 30 dias',
    situacao: 'ATIVO',
    createdAt: '2025-06-15T10:10:00',
    updatedAt: '2025-11-01T08:30:00'
  },
  {
    id: 8,
    sistema: 'ODIN',
    categoria: 'Acesso Temporário',
    perfil: 'Consultor',
    condicoes: 'Requisitados e estagiários com contrato vigente e expiração de conta superior a data atual',
    situacao: 'INATIVO',
    createdAt: '2025-07-20T15:30:00',
    updatedAt: '2025-12-10T17:00:00'
  }
];

let nextId = 9;

@Injectable({ providedIn: 'root' })
export class OdinRuleService {

  getRules(page: number = 0, size: number = 10, search?: string): Observable<OdinRulePage> {
    let filtered = [...MOCK_RULES];

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(r =>
        r.categoria.toLowerCase().includes(term) ||
        r.perfil.toLowerCase().includes(term) ||
        r.condicoes.toLowerCase().includes(term)
      );
    }

    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const content = filtered.slice(start, start + size);

    return of({ content, totalElements, totalPages, page, size }).pipe(delay(300));
  }

  createRule(rule: Partial<OdinRule>): Observable<OdinRule> {
    const now = new Date().toISOString();
    const newRule: OdinRule = {
      id: nextId++,
      sistema: 'ODIN',
      categoria: rule.categoria || '',
      perfil: rule.perfil || '',
      condicoes: rule.condicoes || '',
      situacao: rule.situacao || 'ATIVO',
      createdAt: now,
      updatedAt: now
    };
    MOCK_RULES = [newRule, ...MOCK_RULES];
    return of(newRule).pipe(delay(300));
  }

  updateRule(id: number, rule: Partial<OdinRule>): Observable<OdinRule> {
    const index = MOCK_RULES.findIndex(r => r.id === id);
    if (index >= 0) {
      MOCK_RULES[index] = {
        ...MOCK_RULES[index],
        ...rule,
        updatedAt: new Date().toISOString()
      };
      return of(MOCK_RULES[index]).pipe(delay(300));
    }
    return of(MOCK_RULES[0]).pipe(delay(300));
  }

  deleteRule(id: number): Observable<boolean> {
    MOCK_RULES = MOCK_RULES.filter(r => r.id !== id);
    return of(true).pipe(delay(300));
  }
}
