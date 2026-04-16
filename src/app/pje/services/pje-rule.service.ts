import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

export interface PjeRule {
  id: number;
  lotacao: string;
  lotacaoFilha: string;
  funcao: string;
  sistema: string;
  perfil: string;
  localizacao: string;
  grupoTrabalho: string;
  origem: string;
  situacaoFuncional: string;
}

const INITIAL_RULES: PjeRule[] = [
  { id: 1, lotacao: 'COAJU', lotacaoFilha: 'Sim', funcao: 'Chefe de Cartório', sistema: 'PJe 1G', perfil: 'Servidor;Diretor de Secretaria', localizacao: '1ª Zona Eleitoral - São Luís', grupoTrabalho: 'Equipe PJe 1G - São Luís', origem: 'TRE-MA', situacaoFuncional: 'Ativo' },
  { id: 2, lotacao: 'AEJUS', lotacaoFilha: 'Não', funcao: 'Juiz Eleitoral', sistema: 'PJe 2G', perfil: 'Magistrado', localizacao: 'Tribunal Pleno', grupoTrabalho: 'Equipe PJe 2G - Tribunal Pleno', origem: 'TRE-MA', situacaoFuncional: 'Ativo' },
  { id: 3, lotacao: 'COTIC', lotacaoFilha: 'Sim', funcao: 'Analista Judiciário', sistema: 'PJe 1G', perfil: 'Administrador;Servidor', localizacao: '2ª Zona Eleitoral - São Luís', grupoTrabalho: 'Suporte Técnico PJe', origem: 'TRE-MA', situacaoFuncional: 'Ativo' },
  { id: 4, lotacao: 'SECAD', lotacaoFilha: 'Não', funcao: 'Diretor de Secretaria', sistema: 'PJe 1G', perfil: 'Diretor de Secretaria;Contador Judicial', localizacao: '3ª Zona Eleitoral - Imperatriz', grupoTrabalho: '', origem: 'TSE', situacaoFuncional: 'Ativo' },
  { id: 5, lotacao: 'AEMAG', lotacaoFilha: 'Não', funcao: 'Assessor de Juiz', sistema: 'PJe 2G', perfil: 'Assessor de Plenário;Magistrado', localizacao: 'Corregedoria', grupoTrabalho: 'Equipe PJe 2G - Tribunal Pleno', origem: 'TRE-MA', situacaoFuncional: 'Ativo' },
  { id: 6, lotacao: 'SEGER', lotacaoFilha: 'Sim', funcao: 'Coordenador', sistema: 'PJe 1G', perfil: 'Servidor;Atendente', localizacao: '4ª Zona Eleitoral - Caxias', grupoTrabalho: '', origem: 'CNJ', situacaoFuncional: 'Cedido' },
  { id: 7, lotacao: 'COGER', lotacaoFilha: 'Não', funcao: 'Supervisor', sistema: 'PJe 2G', perfil: 'Coordenador;Distribuidor', localizacao: 'Secretaria Judiciária', grupoTrabalho: 'Administradores PJe', origem: 'TRE-MA', situacaoFuncional: 'Ativo' },
  { id: 8, lotacao: 'COPER', lotacaoFilha: 'Sim', funcao: 'Técnico Judiciário', sistema: 'PJe 1G', perfil: 'Oficial de Justiça;Servidor', localizacao: '5ª Zona Eleitoral - Timon', grupoTrabalho: 'Equipe PJe 1G - São Luís', origem: 'TRE-MA', situacaoFuncional: 'Ativo' },
  { id: 9, lotacao: 'ASCOM', lotacaoFilha: 'Não', funcao: 'Analista Judiciário', sistema: 'PJe 2G', perfil: 'Publicador', localizacao: 'Assessoria Jurídica', grupoTrabalho: '', origem: 'TRE-MA', situacaoFuncional: 'Licenciado' },
  { id: 10, lotacao: 'SETIC', lotacaoFilha: 'Sim', funcao: 'Coordenador', sistema: 'PJe 1G', perfil: 'Administrador;Perito', localizacao: '6ª Zona Eleitoral - Bacabal', grupoTrabalho: 'Suporte Técnico PJe', origem: 'TRE-MA', situacaoFuncional: 'Ativo' }
];

@Injectable({ providedIn: 'root' })
export class PjeRuleService {
  private rules: PjeRule[] = [...INITIAL_RULES];
  private nextId = 11;

  getRules(
    page: number = 0,
    size: number = 10,
    search: string = '',
    sort: string = 'id'
  ): Observable<{ data: PjeRule[]; total: number }> {
    let filtered = [...this.rules];

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(r =>
        r.lotacao.toLowerCase().includes(s) ||
        r.perfil.toLowerCase().includes(s) ||
        r.sistema.toLowerCase().includes(s) ||
        r.funcao.toLowerCase().includes(s) ||
        r.localizacao.toLowerCase().includes(s)
      );
    }

    filtered.sort((a, b) => {
      const aVal = (a as any)[sort] ?? '';
      const bVal = (b as any)[sort] ?? '';
      return String(aVal).localeCompare(String(bVal));
    });

    const total = filtered.length;
    const data = filtered.slice(page * size, (page + 1) * size);
    return of({ data, total }).pipe(delay(300));
  }

  createRule(rule: Omit<PjeRule, 'id'>): Observable<PjeRule> {
    const newRule: PjeRule = { ...rule, id: this.nextId++ };
    this.rules.push(newRule);
    return of(newRule).pipe(delay(300));
  }

  updateRule(id: number, rule: Partial<PjeRule>): Observable<PjeRule> {
    const idx = this.rules.findIndex(r => r.id === id);
    if (idx >= 0) {
      this.rules[idx] = { ...this.rules[idx], ...rule };
      return of(this.rules[idx]).pipe(delay(300));
    }
    return of(null as any).pipe(delay(300));
  }

  deleteRule(id: number): Observable<boolean> {
    const idx = this.rules.findIndex(r => r.id === id);
    if (idx >= 0) {
      this.rules.splice(idx, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
}
