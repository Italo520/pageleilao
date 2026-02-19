"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { LeilaoResumo, LeilaoRelatorioResumo } from "@/types/leilao";
import { Badge } from "@/components/ui/badge";
import { formatarData } from "@/utils/leilao";
import useSWR from "swr";
import {
  Layers,
  User,
  Gavel,
  Scale,
  AlertCircle,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import Image from "next/image";

interface LeilaoDetalhesDialogProps {
  id: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: LeilaoResumo; // Para fallback se já tiver os dados
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function LeilaoDetalhesDialog({
  id,
  open,
  onOpenChange,
  initialData,
}: LeilaoDetalhesDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const {
    data: leilao,
    error,
    isLoading,
  } = useSWR<LeilaoResumo>(id ? `/api/leiloes/${id}` : null, fetcher, {
    fallbackData: initialData,
    revalidateOnFocus: false,
  });

  if (!id) return null;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] h-[85vh] md:w-[900px] md:h-[700px] p-0 overflow-hidden flex flex-col">
          <LeilaoDetalhesContent
            leilao={leilao}
            isLoading={isLoading}
            error={error}
            TitleComponent={DialogTitle}
            HeaderComponent={DialogHeader}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-dvh max-h-dvh p-0 overflow-hidden flex flex-col ">
        <LeilaoDetalhesContent
          leilao={leilao}
          isLoading={isLoading}
          error={error}
          TitleComponent={DrawerTitle}
          HeaderComponent={DrawerHeader}
        />
      </DrawerContent>
    </Drawer>
  );
}

interface LeilaoDetalhesContentProps {
  leilao: LeilaoResumo | undefined;
  isLoading: boolean;
  error: any;
  TitleComponent: React.ComponentType<any>;
  HeaderComponent: React.ComponentType<any>;
}

function LeilaoDetalhesContent({
  leilao,
  isLoading,
  error,
  TitleComponent,
  HeaderComponent,
}: LeilaoDetalhesContentProps) {
  return (
    <>
      <HeaderComponent className="p-6 border-b shrink-0 bg-muted/20">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TitleComponent className="text-md md:text-xl font-bold leading-tight">
                {leilao?.titulo || leilao?.descricaoInterna || "Carregando..."}
              </TitleComponent>
              {leilao?.statusMessage && <Badge>{leilao.statusMessage}</Badge>}
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              {leilao?.codigo && `Cód: ${leilao.codigo}`}{" "}
              {leilao?.slug && `• ${leilao.slug}`}
            </div>
          </div>
        </div>
      </HeaderComponent>

      <div className="flex-grow overflow-hidden flex flex-col">
        {isLoading && !leilao ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-10 text-destructive flex-grow">
            <AlertCircle className="h-10 w-10 mb-2" />
            <p>Erro ao carregar detalhes do leilão.</p>
          </div>
        ) : leilao ? (
          <Tabs
            defaultValue="geral"
            className="flex-grow flex flex-col overflow-hidden"
          >
            <div className="px-6 pt-6 shrink-0">
              <TabsList className="mb-4">
                <TabsTrigger value="geral">Visão Geral</TabsTrigger>
                <TabsTrigger value="resumo">Resumo do Leilão</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="geral"
              className="flex-grow overflow-hidden mt-0 focus-visible:outline-none"
            >
              <ScrollArea className="h-full px-6 pb-6">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Layers className="h-4 w-4" /> Resumo
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>Lotes: {leilao.totalLotes ?? "-"}</li>
                        <li>Habilitados: {leilao.habilitados ?? "-"}</li>
                        <li>Visitas: {leilao.statsVisitas ?? "-"}</li>
                        <li>
                          Venda Direta: {leilao.vendaDireta ? "Sim" : "Não"}
                        </li>
                      </ul>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Scale className="h-4 w-4" /> Estatísticas
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>Lances: {leilao.stats?.lances ?? 0}</li>
                        {leilao.stats?.lote?.bem && (
                          <li className="pt-2 border-t mt-2">
                            <span className="font-medium text-xs uppercase text-muted-foreground">
                              Lote Destaque
                            </span>
                            <p className="line-clamp-2">
                              {leilao.stats.lote.bem.siteTitulo}
                            </p>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {leilao.descricaoInterna}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent
              value="resumo"
              className="flex-grow overflow-hidden mt-0 focus-visible:outline-none"
            >
              <ScrollArea className="h-full px-6 pb-6">
                <ResumoTabContent leilao={leilao} />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : null}
      </div>
    </>
  );
}

import CartazLeilaoResumo from "./CartazLeilaoResumo";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

function ResumoTabContent({ leilao }: { leilao: LeilaoResumo }) {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const {
    data: relatorioData,
    error,
    isLoading,
    mutate,
    isValidating,
  } = useSWR<LeilaoRelatorioResumo>(
    `/api/leiloes/${leilao.id}/resumo`,
    fetcher,
  );

  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadImage = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);
    try {
      // Pequeno delay para garantir renderização
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(printRef.current, {
        useCORS: true,
        scale: 2, // Melhor resolução
        backgroundColor: null,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `resumo-leilao-${leilao.id}.png`;
      link.click();
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
      alert("Erro ao gerar a imagem do relatório.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-4">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  if (error)
    return <div className="p-4 text-destructive">Erro ao carregar resumo.</div>;
  if (!relatorioData?.data?.stats)
    return (
      <div className="p-4 text-muted-foreground">Sem dados disponíveis.</div>
    );

  const stats = relatorioData.data.stats;
  const formatBRL = (val: number | string) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num || 0);
  };

  // Dados para o Cartaz
  const percentualVendido =
    stats.lotesDisponiveis > 0
      ? Math.round((stats.vendidos / stats.lotesDisponiveis) * 100)
      : 0;

  // Formatação de datas
  const dataLeilao = leilao.dataProximoLeilao?.date
    ? new Date(leilao.dataProximoLeilao.date)
    : new Date();
  const dataTexto = `DIA ${format(dataLeilao, "d 'DE' MMMM yyyy", { locale: ptBR }).toUpperCase()}`;
  const diaSemanaTexto = `(${format(dataLeilao, "cccc", { locale: ptBR }).toUpperCase()})`;

  // Comitente principal para subtítulo e logo (se houver)
  const comitentePrincipal = leilao.comitentes?.[0];
  const subtituloDireita =
    comitentePrincipal?.apelido ||
    comitentePrincipal?.pessoa?.name ||
    "LEILÕES PB";
  const logoUrl = comitentePrincipal?.image?.thumb || undefined;
  const fundoUrl = leilao.image?.full?.url || undefined;

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button
          className="flex gap-2"
          variant="outline"
          size="sm"
          onClick={() => mutate()}
          disabled={isValidating}
        >
          <Loader2 className={cn("w-3 h-3", isValidating && "animate-spin")} />
          Recarregar
        </Button>
        <Button
          onClick={handleDownloadImage}
          disabled={isGenerating}
          variant="outline"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {isGenerating ? "Gerando..." : "Gerar Relatório Visual"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/40 p-4 rounded-lg border text-center">
          <p className="text-sm text-muted-foreground">Lotes Disponíveis</p>
          <p className="text-2xl font-bold">{stats.lotesDisponiveis}</p>
        </div>
        <div className="bg-green-50/50 p-4 rounded-lg border border-green-100 text-center">
          <p className="text-sm text-green-700">Vendidos</p>
          <div className="text-2xl font-bold text-green-700">
            {stats.vendidos}
          </div>
          {/* <p className="text-xs text-green-600">
            {stats.lotesVendidos || "Nenhum"}
          </p> */}
        </div>
        {stats.lotesCondicionais.split(",").length > 0 &&
          stats.lotesCondicionais !== "" && (
            <div className="bg-green-50/50 p-4 rounded-lg border border-green-100 text-center">
              <p className="text-sm text-purple-700">Condicionais</p>
              <div className="text-2xl font-bold text-purple-700">
                {stats.lotesCondicionais.split(",").length}
              </div>
              {/* <p className="text-xs text-green-600">
            {stats.lotesVendidos || "Nenhum"}
          </p> */}
            </div>
          )}
        <div className="bg-red-50/50 p-4 rounded-lg border border-red-100 text-center">
          <p className="text-sm text-red-700">Não Vendidos</p>
          <div className="text-2xl font-bold text-red-700">
            {stats.naoVendidos}
          </div>
          {/* <p
            className="text-xs text-red-600 max-w-full truncate"
            title={stats.lotesNaoVendidos}
          >
            {stats.lotesNaoVendidos}
          </p> */}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <tbody className="divide-y">
            <tr className="bg-muted/30">
              <td className="p-3 font-medium">Lances</td>
              <td className="p-3 text-right">
                Online: {stats.lancesOnline} | Presencial:{" "}
                {stats.lancesPresencial}
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Total Vendido</td>
              <td className="p-3 text-right font-bold">
                {stats.statusMessage === "Encerrado"
                  ? formatBRL(stats.totalVendido)
                  : formatBRL(stats.totalPreviaVendas)}
                {stats.statusMessage}
              </td>
            </tr>
            <tr>
              <td className="p-3">Comissão Legaleira</td>
              <td className="p-3 text-right">
                {formatBRL(stats.totalComissao)}
              </td>
            </tr>
            <tr>
              <td className="p-3">Taxas Administrativas</td>
              <td className="p-3 text-right">{formatBRL(stats.totalTaxas)}</td>
            </tr>
            <tr className="bg-green-50 font-bold text-green-800">
              <td className="p-3">Valor Total a Receber</td>
              <td className="p-3 text-right">
                {formatBRL(stats.valorTotalAReceber)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <tbody className="divide-y">
            <tr className="bg-muted/30">
              <td className="p-3 font-medium">Lotes</td>
              <td className="p-3 text-right">Total: {leilao.totalLotes}</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Disponíveis</td>
              <td className="p-3 text-right font-bold">
                {stats.lotesDisponiveis}
              </td>
            </tr>
            {stats.lotesRetirados !== "0" && (
              <tr className="bg-red-50 border border-red-200">
                <td className="p-3">Retirados</td>
                <td className="p-3 text-right">{stats.lotesRetirados}</td>
              </tr>
            )}

            <tr className="bg-green-50 border border-green-200">
              <td className="p-3">Vendidos</td>
              <td className="p-3 text-right">{stats.vendidos}</td>
            </tr>
            <tr className="bg-purple-100 border border-purple-200">
              <td className="p-3">Condicionais</td>
              <td className="p-3 text-right">
                {stats.lotesCondicionais !== ""
                  ? stats.lotesCondicionais.split(", ").length
                  : 0}
              </td>
            </tr>
            <tr className="bg-yellow-50 border border-yellow-200">
              <td className="p-3">Não Vendidos</td>
              <td className="p-3 text-right">{stats.naoVendidos}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Elemento oculto para geração da imagem */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <div ref={printRef}>
          <CartazLeilaoResumo
            percentualVendido={percentualVendido}
            lotesDisponibilizados={stats.lotesDisponiveis}
            lotesVendidos={stats.vendidos}
            condicionais={0} // Não temos esse dado na API atual, assumindo 0
            arrecadacao={formatBRL(stats.totalVendido)}
            dataTexto={dataTexto}
            diaSemanaTexto={diaSemanaTexto}
            siteTexto="www.leiloespb.com.br"
            tituloDireita="LEILOADO"
            subtituloDireita={subtituloDireita?.toUpperCase()}
            fundoUrl={fundoUrl}
            logoUrl={logoUrl}
          />
        </div>
      </div>
    </div>
  );
}
