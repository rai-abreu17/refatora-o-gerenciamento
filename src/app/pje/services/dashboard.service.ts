import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  AccessSeriesPoint,
  AccessSeriesResponse,
  ComplianceMetric,
  DashboardFilters,
  DistributionSlice,
  Granularity,
  HeatmapCell,
  KpiCardData,
  LastAccessBucket,
  Localizacao,
  Orgao,
  OrgaoSistemaBucket,
  TipoUsuario,
  PerfilPJe,
  PERFIL_LABEL,
  Sistema,
  StatusConformidade,
  Usuario,
  VinculoCadastral,
} from '../dashboard/dashboard.model';

/** Deterministic PRNG — mulberry32. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Weighted pick helper */
function pick<T>(rng: () => number, items: { v: T; w: number }[]): T {
  const sum = items.reduce((s, i) => s + i.w, 0);
  let r = rng() * sum;
  for (const i of items) {
    if ((r -= i.w) <= 0) return i.v;
  }
  return items[items.length - 1].v;
}

const PRIMEIROS_NOMES = [
  'Ana', 'Bruno', 'Carla', 'Daniel', 'Eduarda', 'Fábio', 'Gabriela', 'Henrique',
  'Isabela', 'João', 'Karla', 'Lucas', 'Marina', 'Nathan', 'Olívia', 'Pedro',
  'Queila', 'Rafael', 'Sofia', 'Thiago', 'Úrsula', 'Vinícius', 'Wellington',
  'Xavier', 'Yasmin', 'Zeca', 'Amanda', 'Beatriz', 'César', 'Débora',
];
const SOBRENOMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Almeida',
  'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho',
  'Araújo', 'Melo', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Freitas',
  'Cavalcanti', 'Moreira', 'Nunes', 'Moura', 'Pinto',
];

const KPI_SPARKLINE_LEN = 12;
const TOTAL_USUARIOS = 220;
const SEED = 20260420;

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly usuarios: Usuario[];

  constructor() {
    this.usuarios = this.seedUsuarios();
  }

  /**
   * Backward-compatible endpoint used previously: totais de acesso por sistema.
   * Agora derivado do mock de séries em memória; a assinatura de rede permanece.
   */
  getAccessCount(
    sistema: Sistema | 'PJe 1G' | 'PJe 2G',
    granularity: Granularity,
    startDate: string,
    endDate: string,
  ): Observable<AccessSeriesResponse> {
    const norm: Sistema = sistema === 'PJe 1G' || sistema === 'PJe1G' ? 'PJe1G' : 'PJe2G';
    const data = this.buildSeries(norm, granularity, new Date(startDate), new Date(endDate));
    const total = data.reduce((s, d) => s + d.count, 0);
    const peak = data.reduce((m, d) => (d.count > m.count ? d : m), data[0]);
    const lowest = data.reduce((m, d) => (d.count < m.count ? d : m), data[0]);
    return of({ sistema: norm, data, total, peak, lowest }).pipe(delay(300));
  }

  /** Snapshot completo usado pelo novo dashboard. */
  getSnapshot(filters: DashboardFilters): Observable<DashboardSnapshot> {
    const filtered = this.filterUsuarios(filters);
    const kpiUsers = {
      acessosCriticos: filtered.filter((u) => u.conformidade.some((c) => c === 'EXPIRADO' || c === 'ACESSO_INVALIDO' || c === 'PROXIMO_EXPIRAR')),
      semEmail: filtered.filter((u) => !u.emailInstitucional),
      perfilInvalido: filtered.filter((u) => u.conformidade.includes('PERFIL_INVALIDO')),
      conformes: filtered.filter((u) => u.conformidade.length === 1 && u.conformidade[0] === 'OK')
    };

    const snap: DashboardSnapshot = {
      totalUsuarios: filtered.length,
      kpis: this.buildKpis(filtered, filters),
      series1G: this.buildSeriesForFilters('PJe1G', filtered, filters),
      series2G: this.buildSeriesForFilters('PJe2G', filtered, filters),
      heatmap: this.buildHeatmap(filtered),
      vinculoDistribution: this.buildVinculoDistribution(filtered),
      tipoUsuarioDistribution: this.buildTipoUsuarioDistribution(filtered),
      perfilDistribution: this.buildPerfilDistribution(filtered),
      orgaoSistema: this.buildOrgaoSistema(filtered),
      lastAccessBuckets: this.buildLastAccessBuckets(filtered),
      compliance: this.buildCompliance(filtered),
      criticos: this.buildCriticos(filtered, 15),
      kpiUsers,
    };
    return of(snap).pipe(delay(200));
  }

  // ────────────────────────────────────────────────────────────────────
  // Geração dos usuários mock
  // ────────────────────────────────────────────────────────────────────
  private seedUsuarios(): Usuario[] {
    const rng = mulberry32(SEED);
    const hoje = new Date('2026-04-20T00:00:00');
    const lista: Usuario[] = [];

    for (let i = 0; i < TOTAL_USUARIOS; i++) {
      const nome = `${pick(rng, PRIMEIROS_NOMES.map((v) => ({ v, w: 1 })))} ${pick(rng, SOBRENOMES.map((v) => ({ v, w: 1 })))}`;
      const orgao: Orgao = pick(rng, [
        { v: 'TRE-MA', w: 65 },
        { v: 'TSE', w: 35 },
      ]);
      const sistema: Sistema = pick(rng, [
        { v: 'PJe1G', w: 70 },
        { v: 'PJe2G', w: 30 },
      ]);
      const tipoUsuario: TipoUsuario = pick(rng, [
        { v: 'INTERNO', w: 70 },
        { v: 'EXTERNO', w: 30 },
      ]);
      const vinculo: VinculoCadastral = pick(rng, [
        { v: 'ATIVO', w: 75 },
        { v: 'INATIVO', w: 15 },
        { v: 'SEM_VINCULO', w: 10 },
      ]);
      // Perfis derivados da Portaria TSE 394/2015 — distribuição típica em Justiça Eleitoral
      const perfil: PerfilPJe = tipoUsuario === 'INTERNO'
        ? pick(rng, [
            { v: 'SERVIDOR', w: 55 },
            { v: 'MAGISTRADO', w: 15 },
            { v: 'ESTAGIARIO', w: 20 },
            { v: 'PROCURADOR', w: 7 },
            { v: 'PERITO', w: 3 },
          ])
        : pick(rng, [
            { v: 'ADVOGADO', w: 70 },
            { v: 'PROCURADOR', w: 18 },
            { v: 'PERITO', w: 12 },
          ]);

      // Localização: unidade institucional do tribunal/procuradoria.
      // Distribuição correlaciona perfil + órgão para refletir a estrutura real.
      let localizacao: Localizacao;
      if (perfil === 'PROCURADOR') {
        localizacao = orgao === 'TSE' ? 'PROCURADORIA_GERAL' : 'PROCURADORIA_REGIONAL';
      } else if (perfil === 'ADVOGADO' || perfil === 'PERITO') {
        // Externos atuam principalmente nos cartórios eleitorais
        localizacao = pick(rng, [
          { v: 'CARTORIO_ELEITORAL', w: 70 },
          { v: 'SECRETARIA_JUDICIARIA', w: 30 },
        ]);
      } else if (perfil === 'MAGISTRADO') {
        localizacao = pick(rng, [
          { v: 'PRESIDENCIA', w: 10 },
          { v: 'CORREGEDORIA', w: 15 },
          { v: 'SECRETARIA_JUDICIARIA', w: 50 },
          { v: 'CARTORIO_ELEITORAL', w: 25 },
        ]);
      } else {
        // Servidores e estagiários distribuídos pelas secretarias e demais unidades
        localizacao = pick(rng, [
          { v: 'SECRETARIA_JUDICIARIA', w: 28 },
          { v: 'SECRETARIA_ADMINISTRACAO', w: 18 },
          { v: 'SECRETARIA_TI', w: 12 },
          { v: 'SECRETARIA_GESTAO_PESSOAS', w: 10 },
          { v: 'CARTORIO_ELEITORAL', w: 18 },
          { v: 'CORREGEDORIA', w: 5 },
          { v: 'ESCOLA_JUDICIARIA', w: 5 },
          { v: 'OUVIDORIA', w: 4 },
        ]);
      }

      const nunca = rng() < 0.08;
      let ultimoAcesso: string | null = null;
      if (!nunca) {
        const diasAtras = Math.floor(
          pick(rng, [
            { v: rng() * 7, w: 55 },        // 0–7 dias (maioria ativa)
            { v: 7 + rng() * 23, w: 25 },   // 7–30
            { v: 30 + rng() * 60, w: 12 },  // 30–90
            { v: 90 + rng() * 180, w: 8 },  // 90–270
          ]) as number,
        );
        const d = new Date(hoje);
        d.setDate(d.getDate() - diasAtras);
        ultimoAcesso = d.toISOString().split('T')[0];
      }

      const conformidade: StatusConformidade[] = [];
      const emailInstitucional = rng() > 0.07;
      if (!emailInstitucional) conformidade.push('SEM_EMAIL_INSTITUCIONAL');
      
      const emailBase = nome.toLowerCase().split(' ').join('.') + '@';
      const emailPje = emailInstitucional ? emailBase + (orgao === 'TRE-MA' ? 'tre-ma.jus.br' : 'tse.jus.br') : (rng() > 0.5 ? emailBase + 'gmail.com' : emailBase + 'hotmail.com');
      const emailTre = emailInstitucional ? emailBase + (orgao === 'TRE-MA' ? 'tre-ma.jus.br' : 'tse.jus.br') : '';
      if (vinculo === 'INATIVO' && !nunca && rng() < 0.6) conformidade.push('ACESSO_INVALIDO');
      if (vinculo === 'SEM_VINCULO' && rng() < 0.7) conformidade.push('ACESSO_INVALIDO');
      if (rng() < 0.09) conformidade.push('EXPIRADO');
      if (rng() < 0.12) conformidade.push('PROXIMO_EXPIRAR');
      
      let motivoPerfilInvalido: string | undefined = undefined;
      if (tipoUsuario === 'INTERNO' && rng() < 0.15) {
        conformidade.push('PERFIL_INVALIDO');
        if (rng() > 0.5) {
          const zonas = ['01ª', '10ª', '20ª', '35ª', '87ª'];
          const zonaAntiga = pick(rng, zonas.map(v => ({v, w:1})));
          const zonaNova = pick(rng, zonas.filter(z => z !== zonaAntiga).map(v => ({v, w:1})));
          motivoPerfilInvalido = `Divergência de lotação: Usuário possui perfil da ${zonaAntiga} ZONA cadastrado no PJe, porém a lotação atual no RH do TRE-MA é ${zonaNova} ZONA. Acesso antigo deve ser revogado.`;
        } else {
          const mutiroes = ['Mutirão Eleições 2024', 'Força-tarefa Biometria', 'Grupo de Apoio Metas CNJ'];
          const mutirao = pick(rng, mutiroes.map(v => ({v, w:1})));
          const papel = pick(rng, [{v: 'Assessor-chefe', w:1}, {v: 'Avaliador', w:1}, {v: 'Coordenador', w:1}]);
          motivoPerfilInvalido = `Privilégio expirado: Usuário mantém perfil de "${papel}" vinculado ao grupo de trabalho "${mutirao}", que foi encerrado oficialmente há mais de 3 meses.`;
        }
      }
      
      if (conformidade.length === 0) conformidade.push('OK');

      lista.push({
        id: `U-${(i + 1).toString().padStart(4, '0')}`,
        nome,
        matricula: Math.floor(10000 + rng() * 89999).toString(),
        orgao,
        sistema,
        tipoUsuario,
        vinculo,
        perfil,
        localizacao,
        conformidade,
        ultimoAcesso,
        emailInstitucional,
        emailPje,
        emailTre,
        motivoPerfilInvalido,
      });
    }

    return lista;
  }

  // ────────────────────────────────────────────────────────────────────
  // Derivações
  // ────────────────────────────────────────────────────────────────────
  private filterUsuarios(f: DashboardFilters): Usuario[] {
    const startMs = f.startDate ? f.startDate.getTime() : null;
    const endMs = f.endDate ? f.endDate.getTime() : null;
    return this.usuarios.filter((u) => {
      if (f.orgaos.length && !f.orgaos.includes(u.orgao)) return false;
      if (f.sistemas.length && !f.sistemas.includes(u.sistema)) return false;
      if (f.tiposUsuario.length && !f.tiposUsuario.includes(u.tipoUsuario)) return false;
      if (f.perfis.length && !f.perfis.includes(u.perfil)) return false;
      if (f.localizacoes.length && !f.localizacoes.includes(u.localizacao)) return false;
      if (startMs !== null || endMs !== null) {
        if (!u.ultimoAcesso) return false;
        const t = new Date(u.ultimoAcesso).getTime();
        if (startMs !== null && t < startMs) return false;
        if (endMs !== null && t > endMs) return false;
      }
      return true;
    });
  }

  private buildKpis(users: Usuario[], f: DashboardFilters): KpiCardData[] {
    const total = users.length;
    const ativos = users.filter((u) => u.vinculo === 'ATIVO').length;
    const expiradosInvalidos = users.filter((u) =>
      u.conformidade.some((c) => c === 'EXPIRADO' || c === 'ACESSO_INVALIDO' || c === 'PROXIMO_EXPIRAR'),
    ).length;
    const semEmail = users.filter((u) => !u.emailInstitucional).length;
    const perfilInvalido = users.filter((u) => u.conformidade.includes('PERFIL_INVALIDO')).length;
    const conformes = users.filter((u) => u.conformidade.length === 1 && u.conformidade[0] === 'OK').length;
    const taxaConformidade = total ? Math.round((conformes / total) * 1000) / 10 : 0;

    const rng = mulberry32(SEED ^ (f.orgaos.length + f.sistemas.length * 7 + f.tiposUsuario.length * 11));
    const spark = (base: number, vol = 0.18) =>
      Array.from({ length: KPI_SPARKLINE_LEN }, (_, i) => {
        const trend = 1 + (i / KPI_SPARKLINE_LEN - 0.5) * 0.15;
        const noise = 1 + (rng() - 0.5) * vol;
        return Math.max(0, Math.round(base * trend * noise));
      });

    return [
      {
        id: 'total-usuarios',
        title: 'Total de usuários',
        value: total.toLocaleString('pt-BR'),
        deltaPct: this.pctFake(rng, -2, 6),
        sparkline: spark(total),
        tone: 'primary',
        hint: `${ativos.toLocaleString('pt-BR')} ativos (${pct(ativos, total)}%)`,
        infoText: 'Total de usuários cadastrados no PJe, contemplando todos os status de vínculo.',
      },
      {
        id: 'acessos-criticos',
        title: 'Acessos críticos',
        value: expiradosInvalidos.toLocaleString('pt-BR'),
        deltaPct: this.pctFake(rng, -12, 4),
        sparkline: spark(expiradosInvalidos, 0.25),
        tone: 'danger',
        hint: 'expirados + inválidos + próximos',
        infoText: 'Soma de usuários com acesso inválido, expirado ou próximo de expirar. Requer atenção imediata.',
      },
      {
        id: 'sem-email',
        title: 'Sem e-mail institucional',
        value: semEmail.toLocaleString('pt-BR'),
        deltaPct: this.pctFake(rng, -8, 2),
        sparkline: spark(semEmail, 0.2),
        tone: 'warning',
        hint: `${pct(semEmail, total)}% do total`,
        infoText: 'Quantidade de usuários cadastrados que não possuem um e-mail institucional registrado.',
      },
      {
        id: 'perfil-invalido',
        title: 'Perfil inválido',
        value: perfilInvalido.toLocaleString('pt-BR'),
        deltaPct: this.pctFake(rng, -4, 8),
        sparkline: spark(perfilInvalido, 0.3),
        tone: 'accent',
        hint: 'requer revisão manual',
        infoText: 'Usuários identificados com perfis incompatíveis com suas funções atuais no sistema.',
      },
      {
        id: 'taxa-conformidade',
        title: 'Taxa de conformidade',
        value: `${taxaConformidade.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%`,
        deltaPct: this.pctFake(rng, -1, 5),
        sparkline: spark(Math.round(taxaConformidade * 10), 0.08),
        tone: 'success',
        hint: `${conformes.toLocaleString('pt-BR')} regulares`,
        infoText: 'Percentual de usuários que estão totalmente regulares, sem pendências ou alertas.',
      },
    ];
  }

  private pctFake(rng: () => number, min: number, max: number): number {
    return Math.round((min + rng() * (max - min)) * 10) / 10;
  }

  private buildSeriesForFilters(
    sistema: Sistema,
    users: Usuario[],
    f: DashboardFilters,
  ): AccessSeriesResponse {
    const start = f.startDate ?? this.defaultStart(f.granularity);
    const end = f.endDate ?? new Date('2026-04-20');
    const usersOfSys = users.filter((u) => u.sistema === sistema).length;
    const scale = Math.max(0.15, usersOfSys / Math.max(1, this.usuarios.length));
    const raw = this.buildSeries(sistema, f.granularity, start, end);
    const data = raw.map((p) => ({ period: p.period, count: Math.round(p.count * scale) }));
    const total = data.reduce((s, d) => s + d.count, 0);
    const peak = data.reduce((m, d) => (d.count > m.count ? d : m), data[0] ?? { period: '', count: 0 });
    const lowest = data.reduce(
      (m, d) => (d.count < m.count ? d : m),
      data[0] ?? { period: '', count: 0 },
    );
    return { sistema, data, total, peak, lowest };
  }

  private defaultStart(g: Granularity): Date {
    const d = new Date('2026-04-20');
    switch (g) {
      case 'day': d.setDate(d.getDate() - 30); break;
      case 'week': d.setDate(d.getDate() - 84); break;
      case 'month': d.setMonth(d.getMonth() - 12); break;
      case 'year': d.setFullYear(d.getFullYear() - 5); break;
    }
    return d;
  }

  private buildSeries(
    sistema: Sistema,
    g: Granularity,
    start: Date,
    end: Date,
  ): AccessSeriesPoint[] {
    const rng = mulberry32(SEED ^ (sistema === 'PJe1G' ? 1 : 2) ^ g.charCodeAt(0));
    const base = sistema === 'PJe1G' ? 1200 : 800;
    const variance = sistema === 'PJe1G' ? 450 : 280;
    const points: AccessSeriesPoint[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      const dow = cur.getDay();
      const weekendFactor = dow === 0 || dow === 6 ? 0.3 : 1;
      const monthFactor = 1 + Math.sin((cur.getMonth() / 12) * Math.PI * 2) * 0.08;
      const count = Math.round((base + (rng() - 0.5) * variance * 2) * weekendFactor * monthFactor);
      points.push({ period: cur.toISOString().split('T')[0], count: Math.max(50, count) });

      switch (g) {
        case 'day': cur.setDate(cur.getDate() + 1); break;
        case 'week': cur.setDate(cur.getDate() + 7); break;
        case 'month': cur.setMonth(cur.getMonth() + 1); break;
        case 'year': cur.setFullYear(cur.getFullYear() + 1); break;
      }
    }
    return points;
  }

  private buildHeatmap(users: Usuario[]): HeatmapCell[] {
    const rng = mulberry32(SEED ^ users.length);
    const cells: HeatmapCell[] = [];
    const activeScale = users.filter((u) => u.ultimoAcesso).length / Math.max(1, this.usuarios.length);
    for (let dia = 0; dia < 7; dia++) {
      const isWeekend = dia === 0 || dia === 6;
      for (let hora = 0; hora < 24; hora++) {
        let weight = 0;
        if (hora >= 8 && hora <= 11) weight = 0.9 + rng() * 0.3;
        else if (hora >= 13 && hora <= 17) weight = 1.0 + rng() * 0.3;
        else if (hora >= 6 && hora < 8) weight = 0.25 + rng() * 0.15;
        else if (hora >= 18 && hora < 21) weight = 0.5 + rng() * 0.2;
        else if (hora >= 21 && hora <= 23) weight = 0.1 + rng() * 0.15;
        else weight = 0.03 + rng() * 0.08;
        if (isWeekend) weight *= 0.25;
        const count = Math.round(weight * 120 * activeScale);
        cells.push({ hora, dia, count });
      }
    }
    return cells;
  }

  private buildVinculoDistribution(users: Usuario[]): DistributionSlice[] {
    const ativos = users.filter((u) => u.vinculo === 'ATIVO').length;
    const inativos = users.filter((u) => u.vinculo === 'INATIVO').length;
    const sem = users.filter((u) => u.vinculo === 'SEM_VINCULO').length;
    return [
      { label: 'Ativo', value: ativos, color: '#2E7D32' },
      { label: 'Inativo', value: inativos, color: '#C62828' },
      { label: 'Sem vínculo', value: sem, color: '#9E9E9E' },
    ];
  }

  private buildTipoUsuarioDistribution(users: Usuario[]): DistributionSlice[] {
    const internos = users.filter((u) => u.tipoUsuario === 'INTERNO').length;
    const externos = users.filter((u) => u.tipoUsuario === 'EXTERNO').length;
    return [
      { label: 'Interno', value: internos, color: '#1B4F8A' },
      { label: 'Externo', value: externos, color: '#E8A000' },
    ];
  }

  private buildPerfilDistribution(users: Usuario[]): DistributionSlice[] {
    const palette: Record<PerfilPJe, string> = {
      MAGISTRADO: '#0F3360',
      SERVIDOR: '#1B4F8A',
      ADVOGADO: '#E8A000',
      PROCURADOR: '#6A1B9A',
      ESTAGIARIO: '#2E7D32',
      PERITO: '#C62828',
    };
    const ordem: PerfilPJe[] = [
      'SERVIDOR', 'ADVOGADO', 'MAGISTRADO', 'PROCURADOR', 'ESTAGIARIO', 'PERITO',
    ];
    return ordem.map((p) => ({
      label: PERFIL_LABEL[p],
      value: users.filter((u) => u.perfil === p).length,
      color: palette[p],
    }));
  }

  private buildOrgaoSistema(users: Usuario[]): OrgaoSistemaBucket[] {
    const combos: OrgaoSistemaBucket[] = [];
    (['TRE-MA', 'TSE'] as Orgao[]).forEach((orgao) => {
      (['PJe1G', 'PJe2G'] as Sistema[]).forEach((sistema) => {
        combos.push({
          orgao,
          sistema,
          count: users.filter((u) => u.orgao === orgao && u.sistema === sistema).length,
        });
      });
    });
    return combos;
  }

  private buildLastAccessBuckets(users: Usuario[]): LastAccessBucket[] {
    const today = new Date('2026-04-20T00:00:00').getTime();
    const day = 24 * 60 * 60 * 1000;
    const never = users.filter((u) => u.ultimoAcesso === null).length;
    const others = users.filter((u) => u.ultimoAcesso !== null);
    const diffs = others.map((u) => Math.floor((today - new Date(u.ultimoAcesso as string).getTime()) / day));
    const lt7 = diffs.filter((d) => d < 7).length;
    const lt30 = diffs.filter((d) => d >= 7 && d < 30).length;
    const lt90 = diffs.filter((d) => d >= 30 && d < 90).length;
    const gt90 = diffs.filter((d) => d >= 90).length;

    return [
      { key: '0-7', label: '< 7 dias', count: lt7, color: '#2E7D32' },
      { key: '7-30', label: '7–30 dias', count: lt30, color: '#1B4F8A' },
      { key: '30-90', label: '30–90 dias', count: lt90, color: '#F57C00' },
      { key: '90+', label: '> 90 dias', count: gt90, color: '#C62828' },
      { key: 'never', label: 'Nunca acessou', count: never, color: '#6A1B9A', highlight: true },
    ];
  }

  private buildCompliance(users: Usuario[]): ComplianceMetric[] {
    const total = users.length || 1;
    const ativosComEmail = users.filter((u) => u.vinculo === 'ATIVO' && u.emailInstitucional).length;
    const perfilOk = users.filter((u) => !u.conformidade.includes('PERFIL_INVALIDO')).length;
    const acessoValido = users.filter(
      (u) => !u.conformidade.some((c) => c === 'ACESSO_INVALIDO' || c === 'EXPIRADO'),
    ).length;
    const vinculoOk = users.filter((u) => u.vinculo !== 'SEM_VINCULO').length;
    return [
      { key: 'email', label: 'Com e-mail institucional ativo', value: ativosComEmail, total, color: '#1B4F8A' },
      { key: 'perfil', label: 'Perfil correto', value: perfilOk, total, color: '#2E7D32' },
      { key: 'acesso', label: 'Acesso válido', value: acessoValido, total, color: '#E8A000' },
      { key: 'vinculo', label: 'Vínculo cadastral presente', value: vinculoOk, total, color: '#6A1B9A' },
    ];
  }

  private buildCriticos(users: Usuario[], limit: number): Usuario[] {
    const pesoConformidade = (u: Usuario): number => {
      let w = 0;
      if (u.conformidade.includes('ACESSO_INVALIDO')) w += 5;
      if (u.conformidade.includes('EXPIRADO')) w += 4;
      if (u.conformidade.includes('PROXIMO_EXPIRAR')) w += 2;
      if (u.conformidade.includes('SEM_EMAIL_INSTITUCIONAL')) w += 3;
      if (u.conformidade.includes('PERFIL_INVALIDO')) w += 3;
      if (u.vinculo !== 'ATIVO') w += 2;
      if (u.ultimoAcesso === null) w += 2;
      return w;
    };
    return [...users].sort((a, b) => pesoConformidade(b) - pesoConformidade(a)).slice(0, limit);
  }
}

function pct(part: number, total: number): string {
  if (!total) return '0';
  return ((part / total) * 100).toFixed(1).replace('.', ',');
}

export interface DashboardSnapshot {
  totalUsuarios: number;
  kpis: KpiCardData[];
  series1G: AccessSeriesResponse;
  series2G: AccessSeriesResponse;
  heatmap: HeatmapCell[];
  vinculoDistribution: DistributionSlice[];
  tipoUsuarioDistribution: DistributionSlice[];
  perfilDistribution: DistributionSlice[];
  orgaoSistema: OrgaoSistemaBucket[];
  lastAccessBuckets: LastAccessBucket[];
  compliance: ComplianceMetric[];
  criticos: Usuario[];
  kpiUsers: {
    acessosCriticos: Usuario[];
    semEmail: Usuario[];
    perfilInvalido: Usuario[];
    conformes: Usuario[];
  };
}

// Reexport para compatibilidade com os imports atuais do dashboard legado
export type { AccessSeriesPoint as AccessDataPoint, AccessSeriesResponse as AccessCountResponse };
