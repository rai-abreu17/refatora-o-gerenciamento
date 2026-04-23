export type Orgao = 'TRE-MA' | 'TSE';
export type Sistema = 'PJe1G' | 'PJe2G';
export type TipoUsuario = 'INTERNO' | 'EXTERNO';
export type VinculoCadastral = 'ATIVO' | 'INATIVO' | 'SEM_VINCULO';
export type PerfilPJe =
  | 'MAGISTRADO'
  | 'SERVIDOR'
  | 'ADVOGADO'
  | 'PROCURADOR'
  | 'ESTAGIARIO'
  | 'PERITO';

export type Localizacao =
  | 'SECRETARIA_JUDICIARIA'
  | 'SECRETARIA_ADMINISTRACAO'
  | 'SECRETARIA_TI'
  | 'SECRETARIA_GESTAO_PESSOAS'
  | 'CORREGEDORIA'
  | 'PRESIDENCIA'
  | 'ESCOLA_JUDICIARIA'
  | 'OUVIDORIA'
  | 'CARTORIO_ELEITORAL'
  | 'PROCURADORIA_REGIONAL'
  | 'PROCURADORIA_GERAL';
export type StatusConformidade =
  | 'OK'
  | 'ACESSO_INVALIDO'
  | 'EXPIRADO'
  | 'PROXIMO_EXPIRAR'
  | 'SEM_EMAIL_INSTITUCIONAL'
  | 'PERFIL_INVALIDO';

export type Granularity = 'day' | 'week' | 'month' | 'year';

export interface Usuario {
  id: string;
  nome: string;
  matricula: string;
  orgao: Orgao;
  sistema: Sistema;
  tipoUsuario: TipoUsuario;
  vinculo: VinculoCadastral;
  perfil: PerfilPJe;
  localizacao: Localizacao;
  conformidade: StatusConformidade[];
  /** ISO date (yyyy-MM-dd) ou null quando o usuário nunca acessou */
  ultimoAcesso: string | null;
  emailInstitucional: boolean;
  emailPje?: string;
  emailTre?: string;
  /** Motivo descritivo para quando o perfil está inválido */
  motivoPerfilInvalido?: string;
}

export interface DashboardFilters {
  granularity: Granularity;
  startDate: Date | null;
  endDate: Date | null;
  orgaos: Orgao[];
  sistemas: Sistema[];
  tiposUsuario: TipoUsuario[];
  perfis: PerfilPJe[];
  localizacoes: Localizacao[];
}

export const EMPTY_FILTERS: DashboardFilters = {
  granularity: 'day',
  startDate: null,
  endDate: null,
  orgaos: [],
  sistemas: [],
  tiposUsuario: [],
  perfis: [],
  localizacoes: [],
};

export type KpiTone = 'primary' | 'info' | 'warning' | 'danger' | 'success' | 'accent';

export interface KpiCardData {
  id: string;
  title: string;
  value: string;
  /** Variação percentual vs período anterior. Positivo/negativo muda o ícone. */
  deltaPct: number | null;
  /** Série para a sparkline (8–12 pontos) */
  sparkline: number[];
  tone: KpiTone;
  /** Texto secundário curto, ex.: "de 1.245 usuários" */
  hint?: string;
  /** Texto explicativo exibido no ícone ℹ */
  infoText?: string;
}

export interface AccessSeriesPoint {
  period: string;
  count: number;
}

export interface AccessSeriesResponse {
  sistema: Sistema;
  data: AccessSeriesPoint[];
  total: number;
  peak: AccessSeriesPoint;
  lowest: AccessSeriesPoint;
}

export interface HeatmapCell {
  /** 0–23 */
  hora: number;
  /** 0 = domingo, 6 = sábado */
  dia: number;
  count: number;
}

export interface DistributionSlice {
  label: string;
  value: number;
  color: string;
}

export interface LastAccessBucket {
  key: '0-7' | '7-30' | '30-90' | '90+' | 'never';
  label: string;
  count: number;
  highlight?: boolean;
  color: string;
}

export interface ComplianceMetric {
  key: string;
  label: string;
  value: number;
  total: number;
  color: string;
}

export interface OrgaoSistemaBucket {
  orgao: Orgao;
  sistema: Sistema;
  count: number;
}

export const ORGAO_LABEL: Record<Orgao, string> = {
  'TRE-MA': 'TRE-MA',
  'TSE': 'TSE',
};

export const SISTEMA_LABEL: Record<Sistema, string> = {
  PJe1G: 'PJe 1G',
  PJe2G: 'PJe 2G',
};

export const TIPO_USUARIO_LABEL: Record<TipoUsuario, string> = {
  INTERNO: 'Interno',
  EXTERNO: 'Externo',
};

export const VINCULO_LABEL: Record<VinculoCadastral, string> = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  SEM_VINCULO: 'Sem vínculo',
};

export const PERFIL_LABEL: Record<PerfilPJe, string> = {
  MAGISTRADO: 'Magistrado',
  SERVIDOR: 'Servidor',
  ADVOGADO: 'Advogado',
  PROCURADOR: 'Procurador',
  ESTAGIARIO: 'Estagiário',
  PERITO: 'Perito',
};

export const LOCALIZACAO_LABEL: Record<Localizacao, string> = {
  SECRETARIA_JUDICIARIA: 'Secretaria Judiciária',
  SECRETARIA_ADMINISTRACAO: 'Secretaria de Administração',
  SECRETARIA_TI: 'Secretaria de Tecnologia da Informação',
  SECRETARIA_GESTAO_PESSOAS: 'Secretaria de Gestão de Pessoas',
  CORREGEDORIA: 'Corregedoria Regional Eleitoral',
  PRESIDENCIA: 'Presidência',
  ESCOLA_JUDICIARIA: 'Escola Judiciária Eleitoral',
  OUVIDORIA: 'Ouvidoria',
  CARTORIO_ELEITORAL: 'Cartório Eleitoral',
  PROCURADORIA_REGIONAL: 'Procuradoria Regional Eleitoral',
  PROCURADORIA_GERAL: 'Procuradoria-Geral Eleitoral',
};

export const CONFORMIDADE_LABEL: Record<StatusConformidade, string> = {
  OK: 'Regular',
  ACESSO_INVALIDO: 'Acesso inválido',
  EXPIRADO: 'Acesso expirado',
  PROXIMO_EXPIRAR: 'Próximo de expirar',
  SEM_EMAIL_INSTITUCIONAL: 'Sem e-mail institucional',
  PERFIL_INVALIDO: 'Perfil inválido',
};
