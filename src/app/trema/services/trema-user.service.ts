import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface TremaUser {
  id: number;
  tituloEleitoral: string;
  nome: string;
  email: string;
  dataNascimento: string;
  genero: string;
  categoriaFuncional: string;
  lotacao: string;
  pontoAtendimento: string;
  mencaoAtendimento: string;
  possuiLdap: boolean;
  login: boolean;
  dataCriacaoConta: string;
  dataModificacaoConta: string;
  ultimoLogin: string;
  expiracaoSenha: string;
  expiracaoConta: string;
  dataFileAcesso: string;
  situacao: string;
  cpf: string;
}

export interface TremaUserPage {
  content: TremaUser[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  lastUpdate: string;
  processingTime: string;
}

const MOCK_USERS: TremaUser[] = [
  {
    id: 1, tituloEleitoral: '0001 2345 6789', nome: 'Maria das Graças Silva', email: 'maria.silva@trema.jus.br',
    dataNascimento: '1978-03-15', genero: 'Feminino', categoriaFuncional: 'Analista Judiciário',
    lotacao: 'Secretaria de Tecnologia da Informação', pontoAtendimento: 'Sede - São Luís',
    mencaoAtendimento: 'Elogio', possuiLdap: true, login: true,
    dataCriacaoConta: '2015-06-10', dataModificacaoConta: '2025-11-20', ultimoLogin: '2026-04-15',
    expiracaoSenha: '2026-07-15', expiracaoConta: '2027-12-31', dataFileAcesso: '2026-04-15',
    situacao: 'Ativo', cpf: '012.345.678-90'
  },
  {
    id: 2, tituloEleitoral: '0002 3456 7890', nome: 'João Pedro Mendonça', email: 'joao.mendonca@trema.jus.br',
    dataNascimento: '1985-07-22', genero: 'Masculino', categoriaFuncional: 'Técnico Judiciário',
    lotacao: 'Coordenadoria de Eleições', pontoAtendimento: 'Sede - São Luís',
    mencaoAtendimento: '', possuiLdap: true, login: true,
    dataCriacaoConta: '2017-02-14', dataModificacaoConta: '2025-10-05', ultimoLogin: '2026-04-14',
    expiracaoSenha: '2026-06-30', expiracaoConta: '2027-12-31', dataFileAcesso: '2026-04-14',
    situacao: 'Ativo', cpf: '123.456.789-01'
  },
  {
    id: 3, tituloEleitoral: '0003 4567 8901', nome: 'Ana Carolina Barbosa Reis', email: 'ana.reis@trema.jus.br',
    dataNascimento: '1990-11-03', genero: 'Feminino', categoriaFuncional: 'Analista Judiciário',
    lotacao: 'Secretaria Judiciária', pontoAtendimento: 'Sede - São Luís',
    mencaoAtendimento: 'Elogio', possuiLdap: true, login: true,
    dataCriacaoConta: '2018-08-20', dataModificacaoConta: '2026-01-15', ultimoLogin: '2026-04-10',
    expiracaoSenha: '2026-08-10', expiracaoConta: '2028-06-30', dataFileAcesso: '2026-04-10',
    situacao: 'Ativo', cpf: '234.567.890-12'
  },
  {
    id: 4, tituloEleitoral: '0004 5678 9012', nome: 'Roberto Carlos Ferreira', email: 'roberto.ferreira@trema.jus.br',
    dataNascimento: '1972-01-28', genero: 'Masculino', categoriaFuncional: 'Requisitado',
    lotacao: 'Gabinete da Presidência', pontoAtendimento: 'Sede - São Luís',
    mencaoAtendimento: '', possuiLdap: true, login: false,
    dataCriacaoConta: '2020-03-01', dataModificacaoConta: '2025-09-18', ultimoLogin: '2025-12-20',
    expiracaoSenha: '2026-03-20', expiracaoConta: '2026-06-30', dataFileAcesso: '2025-12-20',
    situacao: 'Inativo', cpf: '345.678.901-23'
  },
  {
    id: 5, tituloEleitoral: '0005 6789 0123', nome: 'Patrícia Souza Lima', email: 'patricia.lima@trema.jus.br',
    dataNascimento: '1988-05-10', genero: 'Feminino', categoriaFuncional: 'Analista Judiciário',
    lotacao: 'Secretaria de Gestão de Pessoas', pontoAtendimento: 'Sede - São Luís',
    mencaoAtendimento: 'Elogio', possuiLdap: true, login: true,
    dataCriacaoConta: '2016-04-22', dataModificacaoConta: '2026-02-28', ultimoLogin: '2026-04-16',
    expiracaoSenha: '2026-09-01', expiracaoConta: '2028-12-31', dataFileAcesso: '2026-04-16',
    situacao: 'Ativo', cpf: '456.789.012-34'
  },
  {
    id: 6, tituloEleitoral: '0006 7890 1234', nome: 'Marcos Antônio Oliveira', email: 'marcos.oliveira@trema.jus.br',
    dataNascimento: '1980-09-17', genero: 'Masculino', categoriaFuncional: 'Técnico Judiciário',
    lotacao: 'Zona Eleitoral - 1ª ZE São Luís', pontoAtendimento: '1ª ZE São Luís',
    mencaoAtendimento: '', possuiLdap: true, login: true,
    dataCriacaoConta: '2014-11-05', dataModificacaoConta: '2025-08-12', ultimoLogin: '2026-04-13',
    expiracaoSenha: '2026-05-30', expiracaoConta: '2027-12-31', dataFileAcesso: '2026-04-13',
    situacao: 'Ativo', cpf: '567.890.123-45'
  },
  {
    id: 7, tituloEleitoral: '0007 8901 2345', nome: 'Luciana Martins Costa', email: 'luciana.costa@trema.jus.br',
    dataNascimento: '1993-12-05', genero: 'Feminino', categoriaFuncional: 'Estagiário',
    lotacao: 'Assessoria de Comunicação Social', pontoAtendimento: 'Sede - São Luís',
    mencaoAtendimento: '', possuiLdap: false, login: false,
    dataCriacaoConta: '2025-06-01', dataModificacaoConta: '2025-06-01', ultimoLogin: '',
    expiracaoSenha: '2025-12-01', expiracaoConta: '2026-06-01', dataFileAcesso: '',
    situacao: 'Inativo', cpf: '678.901.234-56'
  },
  {
    id: 8, tituloEleitoral: '0008 9012 3456', nome: 'Fernando Henrique Almeida', email: 'fernando.almeida@trema.jus.br',
    dataNascimento: '1975-04-20', genero: 'Masculino', categoriaFuncional: 'Analista Judiciário',
    lotacao: 'Corregedoria Regional Eleitoral', pontoAtendimento: 'Sede - São Luís',
    mencaoAtendimento: 'Elogio', possuiLdap: true, login: true,
    dataCriacaoConta: '2013-09-15', dataModificacaoConta: '2026-03-10', ultimoLogin: '2026-04-16',
    expiracaoSenha: '2026-10-15', expiracaoConta: '2029-12-31', dataFileAcesso: '2026-04-16',
    situacao: 'Ativo', cpf: '789.012.345-67'
  },
  {
    id: 9, tituloEleitoral: '0009 0123 4567', nome: 'Raquel Nascimento Pereira', email: 'raquel.pereira@trema.jus.br',
    dataNascimento: '1982-08-30', genero: 'Feminino', categoriaFuncional: 'Técnico Judiciário',
    lotacao: 'Secretaria de Administração e Orçamento', pontoAtendimento: 'Sede - São Luís',
    mencaoAtendimento: '', possuiLdap: true, login: true,
    dataCriacaoConta: '2016-01-20', dataModificacaoConta: '2025-12-01', ultimoLogin: '2026-04-12',
    expiracaoSenha: '2026-07-01', expiracaoConta: '2027-12-31', dataFileAcesso: '2026-04-12',
    situacao: 'Ativo', cpf: '890.123.456-78'
  },
  {
    id: 10, tituloEleitoral: '0010 1234 5678', nome: 'Thiago Araújo Campos', email: 'thiago.campos@trema.jus.br',
    dataNascimento: '1987-02-14', genero: 'Masculino', categoriaFuncional: 'Requisitado',
    lotacao: 'Zona Eleitoral - 2ª ZE São Luís', pontoAtendimento: '2ª ZE São Luís',
    mencaoAtendimento: '', possuiLdap: true, login: true,
    dataCriacaoConta: '2021-07-10', dataModificacaoConta: '2025-11-05', ultimoLogin: '2026-04-11',
    expiracaoSenha: '2026-06-10', expiracaoConta: '2026-12-31', dataFileAcesso: '2026-04-11',
    situacao: 'Ativo', cpf: '901.234.567-89'
  },
  {
    id: 11, tituloEleitoral: '0011 2345 6789', nome: 'Beatriz Helena Cunha', email: 'beatriz.cunha@trema.jus.br',
    dataNascimento: '1995-06-25', genero: 'Feminino', categoriaFuncional: 'Estagiário',
    lotacao: 'Secretaria de Tecnologia da Informação', pontoAtendimento: 'Sede - São Luís',
    mencaoAtendimento: 'Elogio', possuiLdap: false, login: false,
    dataCriacaoConta: '2025-09-01', dataModificacaoConta: '2025-09-01', ultimoLogin: '',
    expiracaoSenha: '2026-03-01', expiracaoConta: '2026-09-01', dataFileAcesso: '',
    situacao: 'Ativo', cpf: '012.987.654-32'
  },
  {
    id: 12, tituloEleitoral: '0012 3456 7890', nome: 'Carlos Eduardo Santos Neto', email: 'carlos.neto@trema.jus.br',
    dataNascimento: '1970-10-08', genero: 'Masculino', categoriaFuncional: 'Analista Judiciário',
    lotacao: 'Zona Eleitoral - 3ª ZE Imperatriz', pontoAtendimento: '3ª ZE Imperatriz',
    mencaoAtendimento: '', possuiLdap: true, login: true,
    dataCriacaoConta: '2012-05-18', dataModificacaoConta: '2025-07-22', ultimoLogin: '2026-04-09',
    expiracaoSenha: '2026-08-22', expiracaoConta: '2028-12-31', dataFileAcesso: '2026-04-09',
    situacao: 'Ativo', cpf: '321.654.987-00'
  },
  {
    id: 13, tituloEleitoral: '0013 4567 8901', nome: 'Juliana Rocha de Almeida', email: 'juliana.almeida@trema.jus.br',
    dataNascimento: '1991-03-19', genero: 'Feminino', categoriaFuncional: 'Técnico Judiciário',
    lotacao: 'Zona Eleitoral - 4ª ZE Caxias', pontoAtendimento: '4ª ZE Caxias',
    mencaoAtendimento: 'Reclamação', possuiLdap: true, login: true,
    dataCriacaoConta: '2019-11-30', dataModificacaoConta: '2026-01-08', ultimoLogin: '2026-04-08',
    expiracaoSenha: '2026-05-08', expiracaoConta: '2027-12-31', dataFileAcesso: '2026-04-08',
    situacao: 'Ativo', cpf: '654.321.098-76'
  },
  {
    id: 14, tituloEleitoral: '0014 5678 9012', nome: 'Ricardo Pereira Gonçalves', email: 'ricardo.goncalves@trema.jus.br',
    dataNascimento: '1983-11-12', genero: 'Masculino', categoriaFuncional: 'Analista Judiciário',
    lotacao: '', pontoAtendimento: '', mencaoAtendimento: '',
    possuiLdap: true, login: false,
    dataCriacaoConta: '2017-08-25', dataModificacaoConta: '2025-04-10', ultimoLogin: '2025-06-15',
    expiracaoSenha: '2025-10-15', expiracaoConta: '2026-04-10', dataFileAcesso: '2025-06-15',
    situacao: 'Inativo', cpf: '987.654.321-10'
  },
  {
    id: 15, tituloEleitoral: '0015 6789 0123', nome: 'Isabela Fernandes Moura', email: 'isabela.moura@trema.jus.br',
    dataNascimento: '1996-01-30', genero: 'Feminino', categoriaFuncional: 'Estagiário',
    lotacao: 'Secretaria Judiciária', pontoAtendimento: 'Sede - São Luís',
    mencaoAtendimento: '', possuiLdap: false, login: false,
    dataCriacaoConta: '2026-01-15', dataModificacaoConta: '2026-01-15', ultimoLogin: '',
    expiracaoSenha: '2026-07-15', expiracaoConta: '2027-01-15', dataFileAcesso: '',
    situacao: 'Ativo', cpf: '111.222.333-44'
  }
];

@Injectable({ providedIn: 'root' })
export class TremaUserService {

  getUsers(
    filters: {
      tituloOuCpf?: string; nome?: string; lotacao?: string; possuiLotacao?: string;
      categoriaFuncional?: string[]; possuiLdap?: string; possuiRede?: string; situacao?: string;
    },
    page: number = 0,
    size: number = 10
  ): Observable<TremaUserPage> {
    let filtered = [...MOCK_USERS];

    if (filters.tituloOuCpf) {
      const term = filters.tituloOuCpf.toLowerCase();
      filtered = filtered.filter(u =>
        u.tituloEleitoral.toLowerCase().includes(term) || u.cpf.toLowerCase().includes(term)
      );
    }
    if (filters.nome) {
      const term = filters.nome.toLowerCase();
      filtered = filtered.filter(u => u.nome.toLowerCase().includes(term));
    }
    if (filters.lotacao) {
      filtered = filtered.filter(u => u.lotacao === filters.lotacao);
    }
    if (filters.possuiLotacao === 'Sim') {
      filtered = filtered.filter(u => u.lotacao !== '');
    } else if (filters.possuiLotacao === 'Não') {
      filtered = filtered.filter(u => u.lotacao === '');
    }
    if (filters.categoriaFuncional && filters.categoriaFuncional.length > 0) {
      filtered = filtered.filter(u => filters.categoriaFuncional!.includes(u.categoriaFuncional));
    }
    if (filters.possuiLdap === 'Sim') {
      filtered = filtered.filter(u => u.possuiLdap);
    } else if (filters.possuiLdap === 'Não') {
      filtered = filtered.filter(u => !u.possuiLdap);
    }
    if (filters.possuiRede === 'Sim') {
      filtered = filtered.filter(u => u.login);
    } else if (filters.possuiRede === 'Não') {
      filtered = filtered.filter(u => !u.login);
    }
    if (filters.situacao) {
      filtered = filtered.filter(u => u.situacao === filters.situacao);
    }

    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const content = filtered.slice(start, start + size);

    const now = new Date();
    return of({
      content,
      totalElements,
      totalPages,
      page,
      size,
      lastUpdate: now.toLocaleString('pt-BR'),
      processingTime: `${(Math.random() * 800 + 200).toFixed(0)}ms`
    }).pipe(delay(300));
  }

  processUsers(): Observable<{ success: boolean; message: string; count: number }> {
    return of({
      success: true,
      message: 'Processamento concluído com sucesso. 15 usuários atualizados.',
      count: 15
    }).pipe(delay(2000));
  }
}
