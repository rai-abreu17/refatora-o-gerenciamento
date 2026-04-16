import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LookupService {

  getLotacoes(): string[] {
    return [
      'AACRE', 'AECEL', 'AECOP', 'AEJUS', 'AEMAG', 'ASCOM',
      'COAJU', 'COGER', 'COLAB', 'COPER', 'COSIS', 'COTIC',
      'SECAD', 'SEGER', 'SETIC'
    ];
  }

  getCategoriasFuncionais(): string[] {
    return [
      'Juiz', 'Promotor', 'Servidor', 'Servidor Ativo Licenciado',
      'Servidor Cedido', 'Servidor Inativo', 'Servidor Removido',
      'Estagiário', 'Terceirizado', 'Usuário Externo',
      'Oficial de Justiça', 'Colaborador ACT', 'Pensionista'
    ];
  }

  getPerfis(sistema?: string): string[] {
    if (sistema === 'PJe 2G') {
      return [
        'Magistrado', 'Servidor', 'Assessor de Plenário',
        'Distribuidor', 'Diretor de Secretaria', 'Coordenador',
        'Contador', 'Atendente', 'Publicador', 'Administrador'
      ];
    }
    return [
      'Magistrado', 'Servidor', 'Diretor de Secretaria',
      'Assessor', 'Distribuidor', 'Contador Judicial',
      'Oficial de Justiça', 'Perito', 'Administrador', 'Atendente'
    ];
  }

  getLocalizacoes(sistema?: string): string[] {
    if (sistema === 'PJe 2G') {
      return [
        'Tribunal Pleno', 'Corregedoria', 'Secretaria Judiciária',
        'Coordenadoria de Registros', 'Gabinete da Presidência',
        'Assessoria Jurídica', 'Ouvidoria', 'Escola Judiciária'
      ];
    }
    return [
      '1ª Zona Eleitoral - São Luís', '2ª Zona Eleitoral - São Luís',
      '3ª Zona Eleitoral - Imperatriz', '4ª Zona Eleitoral - Caxias',
      '5ª Zona Eleitoral - Timon', '6ª Zona Eleitoral - Bacabal',
      '7ª Zona Eleitoral - Codó', '8ª Zona Eleitoral - Santa Inês'
    ];
  }

  getFuncoes(): string[] {
    return [
      'Juiz Eleitoral', 'Chefe de Cartório', 'Assessor de Juiz',
      'Diretor de Secretaria', 'Coordenador', 'Supervisor',
      'Analista Judiciário', 'Técnico Judiciário'
    ];
  }

  getSistemas(): string[] {
    return ['PJe 1G', 'PJe 2G'];
  }

  getOrigens(): string[] {
    return ['TRE-MA', 'TSE', 'CNJ', 'Outro'];
  }

  getSituacoesFuncionais(): string[] {
    return ['Ativo', 'Inativo', 'Licenciado', 'Cedido', 'Removido', 'Aposentado'];
  }

  getGruposTrabalho(): string[] {
    return [
      'Equipe PJe 1G - São Luís',
      'Equipe PJe 2G - Tribunal Pleno',
      'Suporte Técnico PJe',
      'Administradores PJe',
      'Equipe de Implantação'
    ];
  }
}
