export type ApiDate = {
  date: string;
  timezone?: string;
  timezone_type?: number;
} | null;

export type ImagemComitente = {
  thumb?: string | null;
  full?: string | null;
} | null;

export type ImagemLeilao = {
  full?: {
    url?: string | null;
    resolution?: { width?: number; height?: number } | null;
  } | null;
  thumb?: {
    url?: string | null;
    resolution?: { width?: number; height?: number } | null;
  } | null;
  min?: {
    url?: string | null;
    resolution?: { width?: number; height?: number } | null;
  } | null;
} | null;

export type ComitenteResumo = {
  id: number;
  apelido?: string | null;
  pessoa?: { id: number; name?: string | null } | null;
  image?: ImagemComitente;
};

export type BemImagem = {
  min?: { url?: string | null } | null;
  thumb?: { url?: string | null } | null;
  full?: { url?: string | null } | null;
} | null;

export type StatsResumo = {
  lances?: string | number | null;
  lote?: {
    numero?: number | null;
    bem?: {
      siteTitulo?: string | null;
      cidade?: string | null;
      uf?: string | null;
      image?: BemImagem;
    } | null;
  } | null;
} | null;

export type LeilaoResumo = {
  id: number;
  slug?: string | null;
  codigo?: string | null;
  numero?: number | null;
  ano?: number | null;
  titulo?: string | null;
  descricaoInterna?: string | null;
  destaque?: boolean | null;

  totalLotes?: number | null;
  status?: number | null;
  statusMessage?: string | null;

  dataProximoLeilao?: ApiDate;
  dataAbertura?: ApiDate;
  data1?: ApiDate;

  image?: ImagemLeilao;
  comitentes?: ComitenteResumo[] | null;

  habilitados?: number | null;
  statsVisitas?: number | null;
  stats?: StatsResumo;

  timezone?: string | null;
  vendaDireta?: boolean | null;

  // Campos adicionais que podem vir no detalhe
  leiloeiro?: { nome?: string; registro?: string } | null | unknown;
  classificacao?: { descricao?: string } | null | unknown;
  sistemaTaxa?: { descricao?: string } | null | unknown;
};

export interface LeilaoResponse {
  hoje: LeilaoResumo[];
  result: LeilaoResumo[];
}

export interface LeilaoStats {
  lotesDisponiveis: number;
  vendidos: number;
  naoVendidos: number;
  lancesOnline: number;
  lancesPresencial: number;
  vendasOnline: number;
  vendasPresencial: number;
  totalVendido: number;
  totalComissao: number;
  totalTaxas: number;
  valorTotalAReceber: number;
  valorTotalRecebido: number;
  saldo: string;
  lotesVendidos: string;
  lotesNaoVendidos: string;
  lotesCondicionais: string;
  lotesRetirados: string;
  totalPreviaVendas: string;
  statusMessage: string;
}

export interface LeilaoRelatorioResumo {
  data: {
    stats: LeilaoStats;
  };
}
