import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ApiDate, LeilaoResumo } from "@/types/leilao";

export function formatarData(apiDate?: ApiDate): string {
    if (!apiDate?.date) return "-";
    try {
        // A data da API vem geralmente como "YYYY-MM-DD HH:mm:ss.000000"
        const date = parseISO(apiDate.date);
        return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (e) {
        return apiDate.date;
    }
}

export function pegarImagemCapa(leilao: LeilaoResumo): string | null {
    // Prioridade: min > thumb > full do leilao.image
    if (leilao.image?.min?.url) return leilao.image.min.url;
    if (leilao.image?.thumb?.url) return leilao.image.thumb.url;
    if (leilao.image?.full?.url) return leilao.image.full.url;

    // Fallback: stats.lote.bem.image
    const bemImage = leilao.stats?.lote?.bem?.image;
    if (bemImage?.min?.url) return bemImage.min.url;
    if (bemImage?.thumb?.url) return bemImage.thumb.url;
    if (bemImage?.full?.url) return bemImage.full.url;

    return null;
}
