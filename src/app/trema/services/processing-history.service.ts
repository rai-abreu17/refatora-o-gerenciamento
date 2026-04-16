import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ProcessingHistoryRecord {
  id: number;
  dataInicio: string;
  dataFim: string;
  qtdUsuariosAtualizados: number;
  mensagemAcao: string | null;
  mensagemErro: string | null;
  tempoProcessamento: string;
  tipoProcessamento: 'Manual' | 'Automatico';
  usuarioOperacao: string;
}

export interface ProcessingHistoryPage {
  content: ProcessingHistoryRecord[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface ActionMessage {
  userId: number;
  categoria: string;
  situacaoAnterior: string;
  situacaoNova: string;
  resultado: string;
  detalhe: string;
}

export interface ErrorMessage {
  userId: number;
  mensagem: string;
  detalhe: string;
}

const MOCK_HISTORY: ProcessingHistoryRecord[] = [
  {
    id: 1, dataInicio: '2026-04-16 08:00:00', dataFim: '2026-04-16 08:02:35',
    qtdUsuariosAtualizados: 15, mensagemAcao: '15 ações registradas', mensagemErro: null,
    tempoProcessamento: '2min 35s', tipoProcessamento: 'Manual', usuarioOperacao: 'admin.sistema'
  },
  {
    id: 2, dataInicio: '2026-04-15 02:00:00', dataFim: '2026-04-15 02:05:12',
    qtdUsuariosAtualizados: 42, mensagemAcao: '42 ações registradas', mensagemErro: '3 erros encontrados',
    tempoProcessamento: '5min 12s', tipoProcessamento: 'Automatico', usuarioOperacao: 'sistema.batch'
  },
  {
    id: 3, dataInicio: '2026-04-14 14:30:00', dataFim: '2026-04-14 14:31:18',
    qtdUsuariosAtualizados: 8, mensagemAcao: '8 ações registradas', mensagemErro: null,
    tempoProcessamento: '1min 18s', tipoProcessamento: 'Manual', usuarioOperacao: 'maria.silva'
  },
  {
    id: 4, dataInicio: '2026-04-13 02:00:00', dataFim: '2026-04-13 02:08:45',
    qtdUsuariosAtualizados: 56, mensagemAcao: '56 ações registradas', mensagemErro: '7 erros encontrados',
    tempoProcessamento: '8min 45s', tipoProcessamento: 'Automatico', usuarioOperacao: 'sistema.batch'
  },
  {
    id: 5, dataInicio: '2026-04-12 10:15:00', dataFim: '2026-04-12 10:16:22',
    qtdUsuariosAtualizados: 3, mensagemAcao: '3 ações registradas', mensagemErro: null,
    tempoProcessamento: '1min 22s', tipoProcessamento: 'Manual', usuarioOperacao: 'joao.mendonca'
  },
  {
    id: 6, dataInicio: '2026-04-11 02:00:00', dataFim: '2026-04-11 02:03:50',
    qtdUsuariosAtualizados: 28, mensagemAcao: '28 ações registradas', mensagemErro: '1 erro encontrado',
    tempoProcessamento: '3min 50s', tipoProcessamento: 'Automatico', usuarioOperacao: 'sistema.batch'
  },
  {
    id: 7, dataInicio: '2026-04-10 16:45:00', dataFim: '2026-04-10 16:46:05',
    qtdUsuariosAtualizados: 0, mensagemAcao: null, mensagemErro: null,
    tempoProcessamento: '1min 05s', tipoProcessamento: 'Manual', usuarioOperacao: 'admin.sistema'
  },
  {
    id: 8, dataInicio: '2026-04-09 02:00:00', dataFim: '2026-04-09 02:06:30',
    qtdUsuariosAtualizados: 35, mensagemAcao: '35 ações registradas', mensagemErro: '2 erros encontrados',
    tempoProcessamento: '6min 30s', tipoProcessamento: 'Automatico', usuarioOperacao: 'sistema.batch'
  }
];

const ACTION_MESSAGES: Record<number, ActionMessage[]> = {
  1: [
    { userId: 1, categoria: 'Analista Judiciário', situacaoAnterior: 'Pendente', situacaoNova: 'Ativo', resultado: 'Sucesso', detalhe: 'Conta LDAP criada e permissões atribuídas.' },
    { userId: 2, categoria: 'Técnico Judiciário', situacaoAnterior: 'Ativo', situacaoNova: 'Ativo', resultado: 'Sucesso', detalhe: 'Lotação atualizada de STI para Coordenadoria de Eleições.' },
    { userId: 5, categoria: 'Analista Judiciário', situacaoAnterior: 'Inativo', situacaoNova: 'Ativo', resultado: 'Sucesso', detalhe: 'Conta reativada após retorno de licença.' }
  ],
  2: [
    { userId: 3, categoria: 'Analista Judiciário', situacaoAnterior: 'Ativo', situacaoNova: 'Ativo', resultado: 'Sucesso', detalhe: 'Senha renovada automaticamente.' },
    { userId: 6, categoria: 'Técnico Judiciário', situacaoAnterior: 'Ativo', situacaoNova: 'Ativo', resultado: 'Sucesso', detalhe: 'Perfil de acesso atualizado conforme nova lotação.' },
    { userId: 8, categoria: 'Analista Judiciário', situacaoAnterior: 'Pendente', situacaoNova: 'Ativo', resultado: 'Sucesso', detalhe: 'Conta criada com base nos dados do RH.' },
    { userId: 10, categoria: 'Requisitado', situacaoAnterior: 'Ativo', situacaoNova: 'Ativo', resultado: 'Sucesso', detalhe: 'Expiração de conta prorrogada por 6 meses.' }
  ],
  3: [
    { userId: 4, categoria: 'Requisitado', situacaoAnterior: 'Ativo', situacaoNova: 'Inativo', resultado: 'Sucesso', detalhe: 'Conta desativada por fim de requisição.' },
    { userId: 7, categoria: 'Estagiário', situacaoAnterior: 'Ativo', situacaoNova: 'Inativo', resultado: 'Sucesso', detalhe: 'Contrato de estágio encerrado.' }
  ],
  4: [
    { userId: 9, categoria: 'Técnico Judiciário', situacaoAnterior: 'Ativo', situacaoNova: 'Ativo', resultado: 'Sucesso', detalhe: 'Permissões de sistema atualizadas.' },
    { userId: 12, categoria: 'Analista Judiciário', situacaoAnterior: 'Ativo', situacaoNova: 'Ativo', resultado: 'Sucesso', detalhe: 'Senha expirada renovada automaticamente.' }
  ],
  5: [
    { userId: 11, categoria: 'Estagiário', situacaoAnterior: 'Pendente', situacaoNova: 'Ativo', resultado: 'Sucesso', detalhe: 'Conta de estagiário criada com acesso limitado.' }
  ]
};

const ERROR_MESSAGES: Record<number, ErrorMessage[]> = {
  2: [
    { userId: 14, mensagem: 'Falha ao criar conta LDAP', detalhe: 'Servidor LDAP indisponível no momento da tentativa. Tentativa 3 de 3 esgotada.' },
    { userId: 15, mensagem: 'CPF não encontrado na base do RH', detalhe: 'O CPF 111.222.333-44 não foi localizado no sistema de RH para validação.' },
    { userId: 7, mensagem: 'Expiração de conta já vencida', detalhe: 'A conta do usuário já expirou e não pode ser renovada automaticamente.' }
  ],
  4: [
    { userId: 14, mensagem: 'Timeout na conexão com LDAP', detalhe: 'Conexão excedeu o tempo limite de 30 segundos.' },
    { userId: 13, mensagem: 'Perfil de acesso não encontrado', detalhe: 'O perfil "Atendente ZE" não existe no sistema ODIN.' },
    { userId: 7, mensagem: 'Conta expirada', detalhe: 'Não é possível atualizar conta com status expirado.' },
    { userId: 11, mensagem: 'Erro de validação', detalhe: 'Campo lotação obrigatório para estagiários.' },
    { userId: 15, mensagem: 'Duplicidade de registro', detalhe: 'Já existe um registro ativo para este CPF.' },
    { userId: 4, mensagem: 'Requisição encerrada', detalhe: 'Não é possível atualizar usuário com requisição finalizada.' },
    { userId: 2, mensagem: 'Permissão insuficiente', detalhe: 'O processo batch não possui permissão para alterar este perfil.' }
  ],
  6: [
    { userId: 14, mensagem: 'Servidor LDAP intermitente', detalhe: 'Falha parcial na comunicação com o servidor LDAP.' }
  ],
  8: [
    { userId: 13, mensagem: 'Zona Eleitoral não cadastrada', detalhe: 'A 4ª ZE Caxias não possui registro válido no ODIN.' },
    { userId: 15, mensagem: 'Data de nascimento inválida', detalhe: 'Formato de data incompatível com o padrão esperado.' }
  ]
};

@Injectable({ providedIn: 'root' })
export class ProcessingHistoryService {

  getHistory(page: number = 0, size: number = 10): Observable<ProcessingHistoryPage> {
    const totalElements = MOCK_HISTORY.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const content = MOCK_HISTORY.slice(start, start + size);
    return of({ content, totalElements, totalPages, page, size }).pipe(delay(300));
  }

  getActionMessages(id: number): Observable<ActionMessage[]> {
    return of(ACTION_MESSAGES[id] || []).pipe(delay(300));
  }

  getErrorMessages(id: number): Observable<ErrorMessage[]> {
    return of(ERROR_MESSAGES[id] || []).pipe(delay(300));
  }

  getUpdatedUsers(id: number): Observable<ActionMessage[]> {
    return of(ACTION_MESSAGES[id] || []).pipe(delay(300));
  }
}
