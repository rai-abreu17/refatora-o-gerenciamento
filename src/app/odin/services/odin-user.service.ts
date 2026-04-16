import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface OdinUser {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  categoriaFuncional: string;
  lotacao: string;
  situacao: string;
  origem: string;
  perfil: string;
  sistema: string;
}

export interface OdinUserPage {
  content: OdinUser[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  lastUpdate: string;
  processingTime: string;
}

const MOCK_USERS: OdinUser[] = [
  {
    id: 1,
    cpf: '012.345.678-90',
    nome: 'Ana Paula Ribeiro Santos',
    email: 'ana.santos@trema.jus.br',
    categoriaFuncional: 'Analista Judiciário',
    lotacao: 'Secretaria de Tecnologia da Informação',
    situacao: 'Ativo',
    origem: 'LDAP',
    perfil: 'Administrador',
    sistema: 'ODIN'
  },
  {
    id: 2,
    cpf: '123.456.789-01',
    nome: 'Carlos Eduardo Mendes',
    email: 'carlos.mendes@trema.jus.br',
    categoriaFuncional: 'Técnico Judiciário',
    lotacao: 'Coordenadoria de Eleições',
    situacao: 'Ativo',
    origem: 'Manual',
    perfil: 'Operador',
    sistema: 'ODIN'
  },
  {
    id: 3,
    cpf: '234.567.890-12',
    nome: 'Fernanda Lima Costa',
    email: 'fernanda.costa@trema.jus.br',
    categoriaFuncional: 'Analista Judiciário',
    lotacao: 'Secretaria Judiciária',
    situacao: 'Inativo',
    origem: 'LDAP',
    perfil: 'Consultor',
    sistema: 'ODIN'
  },
  {
    id: 4,
    cpf: '345.678.901-23',
    nome: 'Ricardo Oliveira Souza',
    email: 'ricardo.souza@trema.jus.br',
    categoriaFuncional: 'Requisitado',
    lotacao: 'Gabinete da Presidência',
    situacao: 'Ativo',
    origem: 'LDAP',
    perfil: 'Administrador',
    sistema: 'ODIN'
  },
  {
    id: 5,
    cpf: '456.789.012-34',
    nome: 'Mariana Ferreira Alves',
    email: 'mariana.alves@trema.jus.br',
    categoriaFuncional: 'Estagiário',
    lotacao: 'Secretaria de Gestão de Pessoas',
    situacao: 'Ativo',
    origem: 'Manual',
    perfil: 'Consultor',
    sistema: 'ODIN'
  },
  {
    id: 6,
    cpf: '567.890.123-45',
    nome: 'José Marcos Pereira',
    email: 'jose.pereira@trema.jus.br',
    categoriaFuncional: 'Técnico Judiciário',
    lotacao: 'Zona Eleitoral - 1ª ZE São Luís',
    situacao: 'Ativo',
    origem: 'LDAP',
    perfil: 'Operador',
    sistema: 'ODIN'
  },
  {
    id: 7,
    cpf: '678.901.234-56',
    nome: 'Patrícia Rocha Nascimento',
    email: 'patricia.nascimento@trema.jus.br',
    categoriaFuncional: 'Analista Judiciário',
    lotacao: 'Corregedoria Regional Eleitoral',
    situacao: 'Inativo',
    origem: 'Manual',
    perfil: 'Consultor',
    sistema: 'ODIN'
  },
  {
    id: 8,
    cpf: '789.012.345-67',
    nome: 'Lucas Gabriel Martins',
    email: 'lucas.martins@trema.jus.br',
    categoriaFuncional: 'Analista Judiciário',
    lotacao: 'Secretaria de Administração e Orçamento',
    situacao: 'Ativo',
    origem: 'LDAP',
    perfil: 'Administrador',
    sistema: 'ODIN'
  },
  {
    id: 9,
    cpf: '890.123.456-78',
    nome: 'Beatriz Helena Cunha',
    email: 'beatriz.cunha@trema.jus.br',
    categoriaFuncional: 'Requisitado',
    lotacao: 'Assessoria de Comunicação Social',
    situacao: 'Ativo',
    origem: 'LDAP',
    perfil: 'Operador',
    sistema: 'ODIN'
  },
  {
    id: 10,
    cpf: '901.234.567-89',
    nome: 'Thiago Araújo Campos',
    email: 'thiago.campos@trema.jus.br',
    categoriaFuncional: 'Técnico Judiciário',
    lotacao: 'Zona Eleitoral - 2ª ZE São Luís',
    situacao: 'Ativo',
    origem: 'Manual',
    perfil: 'Consultor',
    sistema: 'ODIN'
  }
];

@Injectable({ providedIn: 'root' })
export class OdinUserService {

  getUsers(
    filters: { cpf?: string; nome?: string; lotacao?: string; categoriaFuncional?: string; situacao?: string; perfil?: string },
    page: number = 0,
    size: number = 10
  ): Observable<OdinUserPage> {
    let filtered = [...MOCK_USERS];

    if (filters.cpf) {
      const term = filters.cpf.toLowerCase();
      filtered = filtered.filter(u => u.cpf.toLowerCase().includes(term));
    }
    if (filters.nome) {
      const term = filters.nome.toLowerCase();
      filtered = filtered.filter(u => u.nome.toLowerCase().includes(term));
    }
    if (filters.lotacao) {
      const term = filters.lotacao.toLowerCase();
      filtered = filtered.filter(u => u.lotacao.toLowerCase().includes(term));
    }
    if (filters.categoriaFuncional) {
      filtered = filtered.filter(u => u.categoriaFuncional === filters.categoriaFuncional);
    }
    if (filters.situacao) {
      filtered = filtered.filter(u => u.situacao === filters.situacao);
    }
    if (filters.perfil) {
      filtered = filtered.filter(u => u.perfil === filters.perfil);
    }

    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const content = filtered.slice(start, start + size);

    const now = new Date();
    const result: OdinUserPage = {
      content,
      totalElements,
      totalPages,
      page,
      size,
      lastUpdate: now.toLocaleString('pt-BR'),
      processingTime: `${(Math.random() * 500 + 100).toFixed(0)}ms`
    };

    return of(result).pipe(delay(300));
  }
}
