"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { LeilaoResumo, LeilaoRelatorioResumo } from "@/types/leilao";
import { Badge } from "@/components/ui/badge";
import { formatarData } from "@/utils/leilao";
import useSWR from "swr";
import { Layers, User, Gavel, Scale, AlertCircle, FileText } from "lucide-react";
import Image from "next/image";

interface LeilaoDetalhesDialogProps {
    id: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: LeilaoResumo; // Para fallback se já tiver os dados
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function LeilaoDetalhesDialog({ id, open, onOpenChange, initialData }: LeilaoDetalhesDialogProps) {
    const { data: leilao, error, isLoading } = useSWR<LeilaoResumo>(
        id ? `/api/leiloes/${id}` : null,
        fetcher,
        {
            fallbackData: initialData, // Usa dados parciais enquanto carrega o completo
            revalidateOnFocus: false
        }
    );

    if (!id) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden flex flex-col">
                <DialogHeader className="p-6 border-b shrink-0 bg-muted/20">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <DialogTitle className="text-xl font-bold leading-tight">
                                    {leilao?.titulo || leilao?.descricaoInterna || "Carregando..."}
                                </DialogTitle>
                                {leilao?.statusMessage && <Badge>{leilao.statusMessage}</Badge>}
                            </div>
                            <div className="text-sm text-muted-foreground font-mono">
                                {leilao?.codigo && `Cód: ${leilao.codigo}`} {leilao?.slug && `• ${leilao.slug}`}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-grow p-6">
                    {isLoading && !leilao ? (
                        <div className="space-y-4">
                            <Skeleton className="h-40 w-full rounded-lg" />
                            <Skeleton className="h-8 w-1/3" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-10 text-destructive">
                            <AlertCircle className="h-10 w-10 mb-2" />
                            <p>Erro ao carregar detalhes do leilão.</p>
                        </div>
                    ) : leilao ? (
                        <Tabs defaultValue="geral" className="w-full">
                            <TabsList className="mb-4">
                                <TabsTrigger value="geral">Visão Geral</TabsTrigger>
                                <TabsTrigger value="datas">Datas</TabsTrigger>
                                <TabsTrigger value="comitentes">Comitentes</TabsTrigger>
                                <TabsTrigger value="resumo">Resumo do Leilão</TabsTrigger>
                                <TabsTrigger value="info">Informações</TabsTrigger>
                            </TabsList>

                            <TabsContent value="geral" className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                                        <h4 className="font-semibold flex items-center gap-2">
                                            <Layers className="h-4 w-4" /> Resumo
                                        </h4>
                                        <ul className="text-sm space-y-1">
                                            <li>Lotes: {leilao.totalLotes ?? "-"}</li>
                                            <li>Habilitados: {leilao.habilitados ?? "-"}</li>
                                            <li>Visitas: {leilao.statsVisitas ?? "-"}</li>
                                            <li>Venda Direta: {leilao.vendaDireta ? "Sim" : "Não"}</li>
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
                                                    <span className="font-medium text-xs uppercase text-muted-foreground">Lote Destaque</span>
                                                    <p className="line-clamp-2">{leilao.stats.lote.bem.siteTitulo}</p>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {leilao.descricaoInterna}
                                </div>
                            </TabsContent>

                            <TabsContent value="datas" className="space-y-4">
                                <div className="grid gap-2 text-sm">
                                    <div className="flex justify-between items-center p-2 rounded hover:bg-muted">
                                        <span className="font-medium">Próximo Leilão</span>
                                        <span>{formatarData(leilao.dataProximoLeilao)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 rounded hover:bg-muted">
                                        <span className="font-medium">Abertura</span>
                                        <span>{formatarData(leilao.dataAbertura)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 rounded hover:bg-muted">
                                        <span className="font-medium">Primeira Praça</span>
                                        <span>{formatarData(leilao.data1)}</span>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="comitentes" className="space-y-4">
                                {leilao.comitentes?.map((c) => (
                                    <div key={c.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50">
                                        <div className="h-10 w-10 relative overflow-hidden rounded-full bg-background border">
                                            {c.image?.thumb ? (
                                                <Image src={c.image.thumb} alt={c.apelido || ""} fill className="object-cover" sizes="40px" />
                                            ) : (
                                                <User className="h-5 w-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{c.pessoa?.name || c.apelido}</p>
                                            <p className="text-xs text-muted-foreground">ID: {c.id}</p>
                                        </div>
                                    </div>
                                ))}
                                {(!leilao.comitentes || leilao.comitentes.length === 0) && (
                                    <p className="text-sm text-muted-foreground">Nenhum comitente informado.</p>
                                )}
                            </TabsContent>

                            <TabsContent value="resumo">
                                <ResumoTabContent leilao={leilao} />
                            </TabsContent>

                            <TabsContent value="info" className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <h4 className="font-medium flex items-center gap-2"><Gavel className="h-4 w-4" /> Leiloeiro</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {(leilao.leiloeiro as { nome?: string })?.nome || "Não informado"}
                                        </p>
                                    </div>
                                    {/* Adicionar mais campos conforme interface detalhada */}
                                </div>
                            </TabsContent>

                        </Tabs>
                    ) : null}
                </ScrollArea>
            </DialogContent>
        </Dialog>
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
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data: relatorioData, error, isLoading } = useSWR<LeilaoRelatorioResumo>(
        `/api/leiloes/${leilao.id}/resumo`,
        fetcher
    );

    const printRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownloadImage = async () => {
        if (!printRef.current) return;
        setIsGenerating(true);
        try {
            // Pequeno delay para garantir renderização
            await new Promise(resolve => setTimeout(resolve, 100));

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

    if (isLoading) return <div className="p-4"><Skeleton className="h-40 w-full" /></div>;
    if (error) return <div className="p-4 text-destructive">Erro ao carregar resumo.</div>;
    if (!relatorioData?.data?.stats) return <div className="p-4 text-muted-foreground">Sem dados disponíveis.</div>;

    const stats = relatorioData.data.stats;
    const formatBRL = (val: number | string) => {
        const num = typeof val === 'string' ? parseFloat(val) : val;
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num || 0);
    };

    // Dados para o Cartaz
    const percentualVendido = stats.lotesDisponiveis > 0
        ? Math.round((stats.vendidos / stats.lotesDisponiveis) * 100)
        : 0;

    // Formatação de datas
    const dataLeilao = leilao.dataProximoLeilao?.date ? new Date(leilao.dataProximoLeilao.date) : new Date();
    const dataTexto = `DIA ${format(dataLeilao, "d 'DE' MMMM yyyy", { locale: ptBR }).toUpperCase()}`;
    const diaSemanaTexto = `(${format(dataLeilao, "cccc", { locale: ptBR }).toUpperCase()})`;

    // Comitente principal para subtítulo e logo (se houver)
    const comitentePrincipal = leilao.comitentes?.[0];
    const subtituloDireita = comitentePrincipal?.apelido || comitentePrincipal?.pessoa?.name || "LEILÕES PB";
    const logoUrl = comitentePrincipal?.image?.thumb || undefined;
    const fundoUrl = leilao.image?.full?.url || undefined;


    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={handleDownloadImage} disabled={isGenerating} variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    {isGenerating ? "Gerando..." : "Gerar Relatório Visual"}
                </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/40 p-4 rounded-lg border text-center">
                    <p className="text-sm text-muted-foreground">Lotes Disponíveis</p>
                    <p className="text-2xl font-bold">{stats.lotesDisponiveis}</p>
                </div>
                <div className="bg-green-50/50 p-4 rounded-lg border border-green-100 text-center">
                    <p className="text-sm text-green-700">Vendidos</p>
                    <div className="text-2xl font-bold text-green-700">{stats.vendidos}</div>
                    <p className="text-xs text-green-600">{stats.lotesVendidos || "Nenhum"}</p>
                </div>
                <div className="bg-red-50/50 p-4 rounded-lg border border-red-100 text-center">
                    <p className="text-sm text-red-700">Não Vendidos</p>
                    <div className="text-2xl font-bold text-red-700">{stats.naoVendidos}</div>
                    <p className="text-xs text-red-600 max-w-full truncate" title={stats.lotesNaoVendidos}>{stats.lotesNaoVendidos}</p>
                </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <tbody className="divide-y">
                        <tr className="bg-muted/30">
                            <td className="p-3 font-medium">Lances</td>
                            <td className="p-3 text-right">Online: {stats.lancesOnline} | Presencial: {stats.lancesPresencial}</td>
                        </tr>
                        <tr>
                            <td className="p-3 font-medium">Total Vendido</td>
                            <td className="p-3 text-right font-bold">{formatBRL(stats.totalVendido)}</td>
                        </tr>
                        <tr>
                            <td className="p-3">Comissão Legaleira</td>
                            <td className="p-3 text-right">{formatBRL(stats.totalComissao)}</td>
                        </tr>
                        <tr>
                            <td className="p-3">Taxas Administrativas</td>
                            <td className="p-3 text-right">{formatBRL(stats.totalTaxas)}</td>
                        </tr>
                        <tr className="bg-green-50 font-bold text-green-800">
                            <td className="p-3">Valor Total a Receber</td>
                            <td className="p-3 text-right">{formatBRL(stats.valorTotalAReceber)}</td>
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
