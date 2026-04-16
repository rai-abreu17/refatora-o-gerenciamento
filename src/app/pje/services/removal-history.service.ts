import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface RemovalRecord {
  id: number;
  nome: string;
  categoria: string;
  lotacao: string;
  sistema: string;
  origemFisica: string;
  localizacaoFisica: string;
  localizacaoModulo: string;
  perfil: string;
  dataInicial: string;
  dataFinal: string;
  tipoRemocao: 'Manual' | 'Automatico';
  dataRemocao: string;
  usuarioRemocao: string;
  dataFimAcesso: string;
  perfilValido: boolean;
  situacao: string;
  notificado: boolean;
  dataNotificacao: string;
}

const MOCK_HISTORY: RemovalRecord[] = [
  { id: 1, nome: 'Maria Fernanda Costa Oliveira', categoria: 'Servidor Inativo', lotacao: 'SECAD', sistema: 'PJe 1G', origemFisica: 'TRE-MA', localizacaoFisica: '3ª Zona Eleitoral - Imperatriz', localizacaoModulo: 'Cartório', perfil: 'Servidor', dataInicial: '2024-06-01', dataFinal: '2026-03-15', tipoRemocao: 'Automatico', dataRemocao: '2026-03-16', usuarioRemocao: 'SISTEMA', dataFimAcesso: '2025-12-15', perfilValido: false, situacao: 'Removido', notificado: true, dataNotificacao: '2026-03-16' },
  { id: 2, nome: 'Marcos Antônio Barros Filho', categoria: 'Servidor Removido', lotacao: 'AECEL', sistema: 'PJe 1G', origemFisica: 'TRE-MA', localizacaoFisica: '1ª Zona Eleitoral - São Luís', localizacaoModulo: 'Cartório', perfil: 'Diretor de Secretaria', dataInicial: '2024-01-01', dataFinal: '2025-12-31', tipoRemocao: 'Manual', dataRemocao: '2026-01-05', usuarioRemocao: 'admin.tre', dataFimAcesso: '2025-11-20', perfilValido: false, situacao: 'Removido', notificado: true, dataNotificacao: '2026-01-05' },
  { id: 3, nome: 'Ricardo Souza Mendes', categoria: 'Terceirizado', lotacao: 'SETIC', sistema: 'PJe 1G', origemFisica: 'TRE-MA', localizacaoFisica: '5ª Zona Eleitoral - Timon', localizacaoModulo: 'Cartório', perfil: 'Atendente', dataInicial: '2025-03-01', dataFinal: '2026-02-28', tipoRemocao: 'Automatico', dataRemocao: '2026-03-01', usuarioRemocao: 'SISTEMA', dataFimAcesso: '2026-01-10', perfilValido: false, situacao: 'Removido', notificado: true, dataNotificacao: '2026-03-01' },
  { id: 4, nome: 'Juliana Cristina Moreira', categoria: 'Servidor', lotacao: 'COPER', sistema: 'PJe 2G', origemFisica: 'TRE-MA', localizacaoFisica: 'Tribunal Pleno', localizacaoModulo: 'Gabinete', perfil: 'Distribuidor', dataInicial: '2025-01-01', dataFinal: '2026-01-31', tipoRemocao: 'Manual', dataRemocao: '2026-02-01', usuarioRemocao: 'coord.pje', dataFimAcesso: '2026-01-30', perfilValido: false, situacao: 'Removido', notificado: false, dataNotificacao: '' },
  { id: 5, nome: 'Paulo Henrique Carvalho', categoria: 'Estagiário', lotacao: 'COGER', sistema: 'PJe 2G', origemFisica: 'TSE', localizacaoFisica: 'Corregedoria', localizacaoModulo: 'Gabinete', perfil: 'Servidor', dataInicial: '2025-06-01', dataFinal: '2026-01-15', tipoRemocao: 'Automatico', dataRemocao: '2026-01-16', usuarioRemocao: 'SISTEMA', dataFimAcesso: '2025-10-20', perfilValido: false, situacao: 'Removido', notificado: true, dataNotificacao: '2026-01-16' },
  { id: 6, nome: 'Amanda Lima Ferreira', categoria: 'Servidor Cedido', lotacao: 'SEGER', sistema: 'PJe 1G', origemFisica: 'CNJ', localizacaoFisica: '4ª Zona Eleitoral - Caxias', localizacaoModulo: 'Cartório', perfil: 'Contador Judicial', dataInicial: '2024-09-01', dataFinal: '2026-02-28', tipoRemocao: 'Manual', dataRemocao: '2026-03-01', usuarioRemocao: 'admin.tre', dataFimAcesso: '2026-02-25', perfilValido: false, situacao: 'Removido', notificado: true, dataNotificacao: '2026-03-02' },
  { id: 7, nome: 'Bruno Alves Nascimento', categoria: 'Servidor', lotacao: 'COAJU', sistema: 'PJe 1G', origemFisica: 'TRE-MA', localizacaoFisica: '2ª Zona Eleitoral - São Luís', localizacaoModulo: 'Cartório', perfil: 'Oficial de Justiça', dataInicial: '2025-02-01', dataFinal: '2026-03-31', tipoRemocao: 'Automatico', dataRemocao: '2026-04-01', usuarioRemocao: 'SISTEMA', dataFimAcesso: '2025-12-28', perfilValido: false, situacao: 'Removido', notificado: true, dataNotificacao: '2026-04-01' },
  { id: 8, nome: 'Isabela Freitas Gonçalves', categoria: 'Servidor Ativo Licenciado', lotacao: 'AECOP', sistema: 'PJe 2G', origemFisica: 'TRE-MA', localizacaoFisica: 'Secretaria Judiciária', localizacaoModulo: 'Coordenadoria', perfil: 'Coordenador', dataInicial: '2025-01-01', dataFinal: '2026-04-10', tipoRemocao: 'Automatico', dataRemocao: '2026-04-11', usuarioRemocao: 'SISTEMA', dataFimAcesso: '2025-10-15', perfilValido: false, situacao: 'Removido', notificado: false, dataNotificacao: '' },
  { id: 9, nome: 'Gustavo Pereira da Silva', categoria: 'Servidor', lotacao: 'COSIS', sistema: 'PJe 1G', origemFisica: 'TRE-MA', localizacaoFisica: '7ª Zona Eleitoral - Codó', localizacaoModulo: 'Cartório', perfil: 'Perito', dataInicial: '2024-11-01', dataFinal: '2026-01-31', tipoRemocao: 'Manual', dataRemocao: '2026-02-05', usuarioRemocao: 'coord.pje', dataFimAcesso: '2026-01-28', perfilValido: false, situacao: 'Removido', notificado: true, dataNotificacao: '2026-02-05' },
  { id: 10, nome: 'Letícia Santos Rodrigues', categoria: 'Servidor', lotacao: 'COTIC', sistema: 'PJe 2G', origemFisica: 'TRE-MA', localizacaoFisica: 'Assessoria Jurídica', localizacaoModulo: 'Assessoria', perfil: 'Publicador', dataInicial: '2025-04-01', dataFinal: '2026-03-31', tipoRemocao: 'Automatico', dataRemocao: '2026-04-01', usuarioRemocao: 'SISTEMA', dataFimAcesso: '2025-12-05', perfilValido: false, situacao: 'Removido', notificado: true, dataNotificacao: '2026-04-02' },
  { id: 11, nome: 'Fernando Costa Pinto', categoria: 'Colaborador ACT', lotacao: 'COLAB', sistema: 'PJe 1G', origemFisica: 'TRE-MA', localizacaoFisica: '8ª Zona Eleitoral - Santa Inês', localizacaoModulo: 'Cartório', perfil: 'Servidor', dataInicial: '2025-07-01', dataFinal: '2026-02-15', tipoRemocao: 'Manual', dataRemocao: '2026-02-20', usuarioRemocao: 'admin.tre', dataFimAcesso: '2026-02-14', perfilValido: false, situacao: 'Removido', notificado: true, dataNotificacao: '2026-02-20' },
  { id: 12, nome: 'Tatiana Rocha Barbosa', categoria: 'Servidor', lotacao: 'AACRE', sistema: 'PJe 2G', origemFisica: 'TRE-MA', localizacaoFisica: 'Escola Judiciária', localizacaoModulo: 'Escola', perfil: 'Servidor', dataInicial: '2025-08-01', dataFinal: '2026-03-15', tipoRemocao: 'Automatico', dataRemocao: '2026-03-16', usuarioRemocao: 'SISTEMA', dataFimAcesso: '2025-11-30', perfilValido: false, situacao: 'Removido', notificado: true, dataNotificacao: '2026-03-17' }
];

@Injectable({ providedIn: 'root' })
export class RemovalHistoryService {

  getHistory(
    page: number = 0,
    size: number = 10,
    search: string = ''
  ): Observable<{ data: RemovalRecord[]; total: number }> {
    let filtered = [...MOCK_HISTORY];

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(r =>
        r.nome.toLowerCase().includes(s) ||
        r.perfil.toLowerCase().includes(s) ||
        r.sistema.toLowerCase().includes(s) ||
        r.lotacao.toLowerCase().includes(s)
      );
    }

    const total = filtered.length;
    const data = filtered.slice(page * size, (page + 1) * size);
    return of({ data, total }).pipe(delay(300));
  }
}
