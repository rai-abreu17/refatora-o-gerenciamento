import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface PjeUser {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  tempoInatividade: string;
  origem: string;
  nomeTrema: string;
  emailTrema: string;
  categoriaFuncional: string;
  lotacao: string;
  dataFim: string;
  situacao: string;
  todosPerfisValidados: boolean;
  sistema: string;
  tipoUsuario: string;
}

export interface PjeAuthorization {
  sistema: string;
  email: string;
  origemAdjudicador: string;
  localizacaoFisica: string;
  modeloLocalizacao: string;
  perfil: string;
  dataInicial: string;
  dataFinal: string;
  perfilRenovavel: boolean;
  tipoRemocao: string;
  dataRemocao: string;
  motivoRemocao: string;
  dataUltimoAcesso: string;
  perfilValido: boolean;
}

export interface PjeUserResponse {
  data: PjeUser[];
  total: number;
  lastUpdate: string;
  processingTime: string;
}

const MOCK_USERS: PjeUser[] = [
  { id: 1, cpf: '12345678909', nome: 'Ana Carolina Silva Mendes', email: 'ana.mendes@pje.jus.br', tempoInatividade: '5 dias', origem: 'TRE-MA', nomeTrema: 'Ana C. S. Mendes', emailTrema: 'ana.mendes@tre-ma.jus.br', categoriaFuncional: 'Servidor', lotacao: 'COAJU', dataFim: '2026-12-31', situacao: 'Ativo', todosPerfisValidados: true, sistema: 'PJe 1G', tipoUsuario: 'Interno' },
  { id: 2, cpf: '98765432100', nome: 'Carlos Eduardo Ribeiro Santos', email: 'carlos.santos@pje.jus.br', tempoInatividade: '30 dias', origem: 'TRE-MA', nomeTrema: 'Carlos E. R. Santos', emailTrema: 'carlos.santos@tre-ma.jus.br', categoriaFuncional: 'Juiz', lotacao: 'AEJUS', dataFim: '2027-06-30', situacao: 'Ativo', todosPerfisValidados: true, sistema: 'PJe 2G', tipoUsuario: 'Magistrado' },
  { id: 3, cpf: '11122233344', nome: 'Maria Fernanda Costa Oliveira', email: 'maria.oliveira@pje.jus.br', tempoInatividade: '90 dias', origem: 'TSE', nomeTrema: 'Maria F. C. Oliveira', emailTrema: 'maria.oliveira@tre-ma.jus.br', categoriaFuncional: 'Servidor Inativo', lotacao: 'SECAD', dataFim: '2026-03-15', situacao: 'Inativo', todosPerfisValidados: false, sistema: 'PJe 1G', tipoUsuario: 'Interno' },
  { id: 4, cpf: '55566677788', nome: 'José Ricardo Almeida Pereira', email: 'jose.pereira@pje.jus.br', tempoInatividade: '2 dias', origem: 'TRE-MA', nomeTrema: 'José R. A. Pereira', emailTrema: 'jose.pereira@tre-ma.jus.br', categoriaFuncional: 'Servidor', lotacao: 'COTIC', dataFim: '2026-12-31', situacao: 'Ativo', todosPerfisValidados: true, sistema: 'PJe 1G', tipoUsuario: 'Interno' },
  { id: 5, cpf: '99988877766', nome: 'Patrícia Lima Nascimento', email: 'patricia.nascimento@pje.jus.br', tempoInatividade: '15 dias', origem: 'TRE-MA', nomeTrema: 'Patrícia L. Nascimento', emailTrema: 'patricia.nascimento@tre-ma.jus.br', categoriaFuncional: 'Estagiário', lotacao: 'COGER', dataFim: '2026-06-30', situacao: 'Ativo', todosPerfisValidados: false, sistema: 'PJe 2G', tipoUsuario: 'Estagiário' },
  { id: 6, cpf: '22233344455', nome: 'Roberto Figueiredo Campos', email: 'roberto.campos@pje.jus.br', tempoInatividade: '0 dias', origem: 'TRE-MA', nomeTrema: 'Roberto F. Campos', emailTrema: 'roberto.campos@tre-ma.jus.br', categoriaFuncional: 'Juiz', lotacao: 'AEMAG', dataFim: '2027-12-31', situacao: 'Ativo', todosPerfisValidados: true, sistema: 'PJe 2G', tipoUsuario: 'Magistrado' },
  { id: 7, cpf: '33344455566', nome: 'Fernanda Beatriz Sousa Ramos', email: 'fernanda.ramos@pje.jus.br', tempoInatividade: '45 dias', origem: 'CNJ', nomeTrema: 'Fernanda B. S. Ramos', emailTrema: 'fernanda.ramos@tre-ma.jus.br', categoriaFuncional: 'Servidor Cedido', lotacao: 'SEGER', dataFim: '2026-09-30', situacao: 'Ativo', todosPerfisValidados: true, sistema: 'PJe 1G', tipoUsuario: 'Interno' },
  { id: 8, cpf: '44455566677', nome: 'Marcos Antônio Barros Filho', email: 'marcos.barros@pje.jus.br', tempoInatividade: '120 dias', origem: 'TRE-MA', nomeTrema: 'Marcos A. B. Filho', emailTrema: 'marcos.barros@tre-ma.jus.br', categoriaFuncional: 'Servidor Removido', lotacao: 'AECEL', dataFim: '2025-12-31', situacao: 'Removido', todosPerfisValidados: false, sistema: 'PJe 1G', tipoUsuario: 'Interno' },
  { id: 9, cpf: '66677788899', nome: 'Juliana Cristina Moreira', email: 'juliana.moreira@pje.jus.br', tempoInatividade: '7 dias', origem: 'TRE-MA', nomeTrema: 'Juliana C. Moreira', emailTrema: 'juliana.moreira@tre-ma.jus.br', categoriaFuncional: 'Servidor', lotacao: 'COPER', dataFim: '2026-12-31', situacao: 'Ativo', todosPerfisValidados: true, sistema: 'PJe 2G', tipoUsuario: 'Interno' },
  { id: 10, cpf: '77788899900', nome: 'Rafael Henrique Cunha Lima', email: 'rafael.lima@pje.jus.br', tempoInatividade: '60 dias', origem: 'TRE-MA', nomeTrema: 'Rafael H. C. Lima', emailTrema: 'rafael.lima@tre-ma.jus.br', categoriaFuncional: 'Terceirizado', lotacao: 'SETIC', dataFim: '2026-04-30', situacao: 'Ativo', todosPerfisValidados: false, sistema: 'PJe 1G', tipoUsuario: 'Externo' },
  { id: 11, cpf: '88899900011', nome: 'Camila Rodrigues Teixeira', email: 'camila.teixeira@pje.jus.br', tempoInatividade: '3 dias', origem: 'TRE-MA', nomeTrema: 'Camila R. Teixeira', emailTrema: 'camila.teixeira@tre-ma.jus.br', categoriaFuncional: 'Servidor', lotacao: 'ASCOM', dataFim: '2026-12-31', situacao: 'Ativo', todosPerfisValidados: true, sistema: 'PJe 1G', tipoUsuario: 'Interno' },
  { id: 12, cpf: '10020030040', nome: 'Pedro Lucas Martins Souza', email: 'pedro.souza@pje.jus.br', tempoInatividade: '10 dias', origem: 'TSE', nomeTrema: 'Pedro L. M. Souza', emailTrema: 'pedro.souza@tre-ma.jus.br', categoriaFuncional: 'Oficial de Justiça', lotacao: 'COLAB', dataFim: '2026-12-31', situacao: 'Ativo', todosPerfisValidados: true, sistema: 'PJe 1G', tipoUsuario: 'Interno' },
  { id: 13, cpf: '20030040050', nome: 'Isabela Freitas Gonçalves', email: 'isabela.goncalves@pje.jus.br', tempoInatividade: '200 dias', origem: 'TRE-MA', nomeTrema: 'Isabela F. Gonçalves', emailTrema: 'isabela.goncalves@tre-ma.jus.br', categoriaFuncional: 'Servidor Ativo Licenciado', lotacao: 'AECOP', dataFim: '2026-08-15', situacao: 'Licenciado', todosPerfisValidados: false, sistema: 'PJe 2G', tipoUsuario: 'Interno' },
  { id: 14, cpf: '30040050060', nome: 'Thiago Augusto Barbosa Neto', email: 'thiago.neto@pje.jus.br', tempoInatividade: '1 dia', origem: 'TRE-MA', nomeTrema: 'Thiago A. B. Neto', emailTrema: 'thiago.neto@tre-ma.jus.br', categoriaFuncional: 'Servidor', lotacao: 'COSIS', dataFim: '2026-12-31', situacao: 'Ativo', todosPerfisValidados: true, sistema: 'PJe 2G', tipoUsuario: 'Interno' },
  { id: 15, cpf: '40050060070', nome: 'Larissa Vieira de Araújo', email: 'larissa.araujo@pje.jus.br', tempoInatividade: '25 dias', origem: 'TRE-MA', nomeTrema: 'Larissa V. Araújo', emailTrema: 'larissa.araujo@tre-ma.jus.br', categoriaFuncional: 'Promotor', lotacao: 'AACRE', dataFim: '2027-03-31', situacao: 'Ativo', todosPerfisValidados: true, sistema: 'PJe 1G', tipoUsuario: 'Externo' }
];

const MOCK_AUTHORIZATIONS: { [userId: number]: PjeAuthorization[] } = {
  1: [
    { sistema: 'PJe 1G', email: 'ana.mendes@pje.jus.br', origemAdjudicador: 'TRE-MA', localizacaoFisica: '1ª Zona Eleitoral - São Luís', modeloLocalizacao: 'Cartório', perfil: 'Servidor', dataInicial: '2025-01-15', dataFinal: '2026-12-31', perfilRenovavel: true, tipoRemocao: '', dataRemocao: '', motivoRemocao: '', dataUltimoAcesso: '2026-04-11', perfilValido: true },
    { sistema: 'PJe 1G', email: 'ana.mendes@pje.jus.br', origemAdjudicador: 'TRE-MA', localizacaoFisica: '2ª Zona Eleitoral - São Luís', modeloLocalizacao: 'Cartório', perfil: 'Atendente', dataInicial: '2025-06-01', dataFinal: '2026-12-31', perfilRenovavel: true, tipoRemocao: '', dataRemocao: '', motivoRemocao: '', dataUltimoAcesso: '2026-04-10', perfilValido: true }
  ],
  2: [
    { sistema: 'PJe 2G', email: 'carlos.santos@pje.jus.br', origemAdjudicador: 'TRE-MA', localizacaoFisica: 'Tribunal Pleno', modeloLocalizacao: 'Gabinete', perfil: 'Magistrado', dataInicial: '2024-03-01', dataFinal: '2027-06-30', perfilRenovavel: true, tipoRemocao: '', dataRemocao: '', motivoRemocao: '', dataUltimoAcesso: '2026-04-14', perfilValido: true },
    { sistema: 'PJe 2G', email: 'carlos.santos@pje.jus.br', origemAdjudicador: 'TRE-MA', localizacaoFisica: 'Corregedoria', modeloLocalizacao: 'Gabinete', perfil: 'Magistrado', dataInicial: '2025-01-01', dataFinal: '2027-06-30', perfilRenovavel: true, tipoRemocao: '', dataRemocao: '', motivoRemocao: '', dataUltimoAcesso: '2026-04-14', perfilValido: true },
    { sistema: 'PJe 2G', email: 'carlos.santos@pje.jus.br', origemAdjudicador: 'TSE', localizacaoFisica: 'Tribunal Pleno', modeloLocalizacao: 'Gabinete', perfil: 'Assessor de Plenário', dataInicial: '2025-07-01', dataFinal: '2026-12-31', perfilRenovavel: false, tipoRemocao: '', dataRemocao: '', motivoRemocao: '', dataUltimoAcesso: '2026-04-12', perfilValido: true }
  ],
  3: [
    { sistema: 'PJe 1G', email: 'maria.oliveira@pje.jus.br', origemAdjudicador: 'TSE', localizacaoFisica: '3ª Zona Eleitoral - Imperatriz', modeloLocalizacao: 'Cartório', perfil: 'Servidor', dataInicial: '2024-06-01', dataFinal: '2026-03-15', perfilRenovavel: false, tipoRemocao: 'Automatico', dataRemocao: '2026-03-16', motivoRemocao: 'Inatividade superior a 90 dias', dataUltimoAcesso: '2025-12-15', perfilValido: false },
    { sistema: 'PJe 1G', email: 'maria.oliveira@pje.jus.br', origemAdjudicador: 'TSE', localizacaoFisica: '3ª Zona Eleitoral - Imperatriz', modeloLocalizacao: 'Cartório', perfil: 'Diretor de Secretaria', dataInicial: '2025-01-01', dataFinal: '2026-03-15', perfilRenovavel: false, tipoRemocao: 'Automatico', dataRemocao: '2026-03-16', motivoRemocao: 'Inatividade superior a 90 dias', dataUltimoAcesso: '2025-12-15', perfilValido: false }
  ]
};

@Injectable({ providedIn: 'root' })
export class PjeUserService {

  getUsers(filters: any = {}, page: number = 0, size: number = 10): Observable<PjeUserResponse> {
    let filtered = [...MOCK_USERS];

    if (filters.nome) {
      filtered = filtered.filter(u => u.nome.toLowerCase().includes(filters.nome.toLowerCase()));
    }
    if (filters.cpf) {
      filtered = filtered.filter(u => u.cpf.includes(filters.cpf.replace(/\D/g, '')));
    }
    if (filters.sistema) {
      filtered = filtered.filter(u => u.sistema === filters.sistema);
    }
    if (filters.situacao) {
      filtered = filtered.filter(u => u.situacao === filters.situacao);
    }
    if (filters.lotacao) {
      filtered = filtered.filter(u => u.lotacao === filters.lotacao);
    }
    if (filters.categoriaFuncional) {
      filtered = filtered.filter(u => u.categoriaFuncional === filters.categoriaFuncional);
    }
    if (filters.origem) {
      filtered = filtered.filter(u => u.origem === filters.origem);
    }
    if (filters.tipoUsuario) {
      filtered = filtered.filter(u => u.tipoUsuario === filters.tipoUsuario);
    }
    if (filters.todosPerfisValidados !== undefined && filters.todosPerfisValidados !== '') {
      const val = filters.todosPerfisValidados === 'true' || filters.todosPerfisValidados === true;
      filtered = filtered.filter(u => u.todosPerfisValidados === val);
    }

    const total = filtered.length;
    const start = page * size;
    const data = filtered.slice(start, start + size);

    return of({
      data,
      total,
      lastUpdate: '16/04/2026 08:32:15',
      processingTime: '1.24s'
    }).pipe(delay(300));
  }

  getAuthorizations(userId: number): Observable<PjeAuthorization[]> {
    const auths = MOCK_AUTHORIZATIONS[userId] || [
      { sistema: 'PJe 1G', email: 'usuario@pje.jus.br', origemAdjudicador: 'TRE-MA', localizacaoFisica: '1ª Zona Eleitoral - São Luís', modeloLocalizacao: 'Cartório', perfil: 'Servidor', dataInicial: '2025-01-01', dataFinal: '2026-12-31', perfilRenovavel: true, tipoRemocao: '', dataRemocao: '', motivoRemocao: '', dataUltimoAcesso: '2026-04-10', perfilValido: true },
      { sistema: 'PJe 1G', email: 'usuario@pje.jus.br', origemAdjudicador: 'TRE-MA', localizacaoFisica: '1ª Zona Eleitoral - São Luís', modeloLocalizacao: 'Cartório', perfil: 'Atendente', dataInicial: '2025-03-01', dataFinal: '2026-12-31', perfilRenovavel: true, tipoRemocao: '', dataRemocao: '', motivoRemocao: '', dataUltimoAcesso: '2026-04-08', perfilValido: true }
    ];
    return of(auths).pipe(delay(200));
  }
}
