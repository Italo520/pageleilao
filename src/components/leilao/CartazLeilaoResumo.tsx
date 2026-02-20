import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  className?: string;

  // (opcionais) se quiser substituir depois por estados/props
  percentualVendido?: number; // 0..100
  lotesDisponibilizados?: number;
  lotesVendidos?: number;
  condicionais?: number;
  arrecadacao?: string;

  dataTexto?: string; // "DIA 11 DE FEVEREIRO 2026"
  diaSemanaTexto?: string; // "(QUARTA-FEIRA)"
  siteTexto?: string; // "www.leiloespb.com.br"

  tituloDireita?: string; // "LEILOADO"
  subtituloDireita?: string; // "TOKIO MARINE SEGURADORA"

  // imagens (placeholders por padrão)
  fundoUrl?: string;
  logoUrl?: string;
};

function DonutPercentual({
  percentual,
  tamanho = 180,
  espessura = 18,
}: {
  percentual: number;
  tamanho?: number;
  espessura?: number;
}) {
  const pct = Math.max(0, Math.min(100, percentual));
  const raio = (tamanho - espessura) / 2;
  const circ = 2 * Math.PI * raio;
  const dash = (pct / 100) * circ;
  const gap = circ - dash;

  return (
    <div className="relative grid place-items-center w-full aspect-square">
      <svg viewBox={`0 0 ${tamanho} ${tamanho}`} className="w-full h-full">
        {/* trilha */}
        <circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth={espessura}
        />
        {/* progresso */}
        <g transform={`rotate(-90 ${tamanho / 2} ${tamanho / 2})`}>
          <circle
            cx={tamanho / 2}
            cy={tamanho / 2}
            r={raio}
            fill="none"
            stroke="#d9b55b"
            strokeWidth={espessura}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
          />
        </g>
      </svg>

      <div className="absolute inset-0 grid place-items-center">
        <div className="grid place-items-center rounded-full bg-black/65 px-3 py-2 @xs:px-5 @xs:py-4 @sm:px-7 @sm:py-6 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
          <div className="text-lg @xs:text-2xl @sm:text-4xl font-extrabold tracking-tight text-white">
            {pct}%
          </div>
        </div>
      </div>
    </div>
  );
}

function LinhaMetrica({
  label,
  valor,
}: {
  label: string;
  valor: string;
  valorDestaque?: boolean;
}) {
  return (
    <div className="flex items-end gap-1.5 @xs:gap-2 @sm:gap-3">
      <div className="min-w-0 shrink-0 text-[10px] @xs:text-xs @sm:text-sm @md:text-lg font-extrabold uppercase tracking-wide text-white">
        {label}
      </div>

      <div className="mb-[4px] @xs:mb-[6px] @sm:mb-[8px] h-[1px] flex-1 border-b border-dotted border-white/35" />

      <div className="text-base @xs:text-xl @sm:text-2xl @md:text-4xl font-extrabold leading-none tabular-nums shrink-0 text-[#d9b55b]">
        {valor}
      </div>
    </div>
  );
}

function CartazContent({
  props,
  className,
  useProxy = false,
}: {
  props: Props;
  className?: string;
  useProxy?: boolean;
}) {
  const percentualVendido = props.percentualVendido ?? 81;
  const lotesDisponibilizados = props.lotesDisponibilizados ?? 53;
  const lotesVendidos = props.lotesVendidos ?? 37;
  const condicionais = props.condicionais ?? 6;
  const arrecadacao = props.arrecadacao ?? "R$ 1.262.400,00";

  const dataTexto = props.dataTexto ?? "DIA 11 DE FEVEREIRO 2026";
  const diaSemanaTexto = props.diaSemanaTexto ?? "(QUARTA-FEIRA)";
  const siteTexto = props.siteTexto ?? "www.leiloespb.com.br";

  const tituloDireita = props.tituloDireita ?? "LEILOADO";
  const subtituloDireita = props.subtituloDireita ?? "TOKIO MARINE SEGURADORA";

  const getProxiedUrl = (url?: string) => {
    if (!url) return undefined;
    if (!useProxy) return url;
    if (url.startsWith("/api/image-proxy") || url.startsWith("data:"))
      return url;
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  };

  const fundoUrl = getProxiedUrl(props.fundoUrl);
  const logoUrl = getProxiedUrl(props.logoUrl);

  return (
    <div
      className={[
        "@container relative w-full overflow-hidden",
        "bg-[#0f0f10] text-white",
        className,
      ].join(" ")}
    >
      {/* Fundo (placeholder) */}
      <div className="absolute inset-0">
        {fundoUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{ backgroundImage: `url(${fundoUrl})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_70%_60%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(900px_600px_at_20%_70%,rgba(217,181,91,0.10),transparent_55%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/55 to-black/75" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.60),transparent_55%)]" />
      </div>

      {/* Conteudo */}
      <div className="relative p-3 @xs:p-4 @sm:p-6 @md:p-8 h-full flex flex-col justify-center">
        {/* Topo */}
        <div className="flex flex-col @xs:flex-row @xs:items-start @xs:justify-between gap-1 @xs:gap-3 @sm:gap-6">
          <div className="min-w-0">
            <div className="text-2xl @xs:text-3xl @sm:text-5xl @md:text-6xl font-black uppercase tracking-wide">
              <span className="bg-gradient-to-r from-[#f3dda0] via-[#d9b55b] to-[#b8862b] bg-clip-text text-transparent">
                LEILAO
              </span>
            </div>

            <div className="mt-0.5 @xs:mt-1 @sm:mt-2 text-xs @xs:text-sm @sm:text-xl @md:text-3xl font-extrabold uppercase tracking-wide text-balance">
              {dataTexto}
            </div>
            <div className="mt-0.5 text-[10px] @xs:text-xs @sm:text-lg @md:text-2xl uppercase tracking-widest text-white/40">
              {diaSemanaTexto}
            </div>
          </div>

          <div className="pt-0 @xs:pt-2 text-[9px] @xs:text-[10px] @sm:text-sm tracking-[0.15em] @xs:tracking-[0.2em] @sm:tracking-[0.3em] text-white/45 shrink-0">
            {siteTexto}
          </div>
        </div>

        {/* Miolo */}
        <div className="mt-4 @xs:mt-5 @sm:mt-6 @md:mt-8 grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] @xs:grid-cols-12 gap-3 @xs:gap-4 @sm:gap-6 items-center">
          {/* Donut */}
          <div className="w-full max-w-[120px] @xs:max-w-none @xs:col-span-5 justify-self-center @xs:justify-self-auto">
            <div className="@xs:mt-4 @sm:mt-8">
              <DonutPercentual percentual={percentualVendido} tamanho={180} />
            </div>
          </div>

          {/* Direita: status + seguradora */}
          <div className="w-full @xs:col-span-7 flex flex-col items-start justify-center min-w-0">
            <div className="mt-6 text-2xl @xs:text-3xl @sm:text-5xl @md:text-6xl font-black uppercase tracking-wide">
              {tituloDireita}
            </div>

            {/* Caixa logo (substituivel) */}
            <div className="absolute top-0 -right-32 mt-2 @xs:mt-3 @sm:mt-5 w-full max-w-[200px] @xs:max-w-[280px] @sm:max-w-[360px] rounded-lg @xs:rounded-xl @sm:rounded-2xl bg-white/92 p-2 @xs:p-3 @sm:p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo seguradora"
                  className="h-7 @xs:h-10 @sm:h-14 w-auto rounded-sm"
                  crossOrigin={useProxy ? "anonymous" : undefined}
                />
              ) : (
                <div className="flex items-center gap-1.5 @xs:gap-2 @sm:gap-3">
                  <div className="h-7 w-7 @xs:h-9 @xs:w-9 @sm:h-12 @sm:w-12 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 shadow-inner shrink-0" />
                  <div className="leading-tight text-black min-w-0">
                    <div className="text-xs @xs:text-base @sm:text-xl font-black uppercase truncate">
                      TOKIO MARINE
                    </div>
                    <div className="text-[9px] @xs:text-xs @sm:text-sm font-semibold uppercase opacity-70">
                      SEGURADORA
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mantém a prop pra uso futuro (não renderiza agora) */}
            <span className="sr-only">{subtituloDireita}</span>
          </div>
        </div>

        {/* Metricas */}
        <div className="mt-4 @xs:mt-6 @sm:mt-8 @md:mt-10 space-y-2 @xs:space-y-3 @sm:space-y-4 @md:space-y-5">
          <LinhaMetrica
            label="LOTES DISPONIBILIZADOS"
            valor={String(lotesDisponibilizados).padStart(2, "0")}
          />
          <LinhaMetrica
            label="LOTES VENDIDOS"
            valor={String(lotesVendidos).padStart(2, "0")}
          />
          {condicionais > 0 && (
            <LinhaMetrica
              label="CONDICIONAIS"
              valor={String(condicionais).padStart(2, "0")}
            />
          )}

          <div className="pt-0.5 @xs:pt-1 @sm:pt-2">
            <div className="flex items-end gap-1.5 @xs:gap-2 @sm:gap-3">
              <div className="min-w-0 shrink-0 text-[10px] @xs:text-xs @sm:text-sm @md:text-lg font-extrabold uppercase tracking-wide text-white">
                ARRECADAÇÃO
              </div>
              <div className="mb-[4px] @xs:mb-[6px] @sm:mb-[8px] h-[1px] flex-1 border-b border-dotted border-white/35" />
              <div className="text-base @xs:text-xl @sm:text-2xl @md:text-4xl font-black text-[#d9b55b] shrink-0">
                {arrecadacao}
              </div>
            </div>
          </div>
        </div>

        {/* Rodape / marca (placeholder) */}
        <div className="mt-4 @xs:mt-6 @sm:mt-8 flex items-center gap-2 @xs:gap-3 @sm:gap-4 justify-end">
          <div>
            <div className="text-sm @xs:text-lg @sm:text-xl @md:text-2xl font-black tracking-widest text-[#d9b55b]">
              LEILOES PB
            </div>
            <div className="text-[8px] @xs:text-[10px] @sm:text-xs font-semibold uppercase tracking-[0.2em] @xs:tracking-[0.3em] @sm:tracking-[0.45em] text-[#d9b55b]/70">
              CASA DE LEILOES
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export default function CartazLeilaoResumo(props: Props) {
  const [isSharing, setIsSharing] = useState(false);
  const hiddenRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (!hiddenRef.current) return;

    // iOS: precisa ser disparado diretamente no clique (gesto do usuário)
    setIsSharing(true);

    try {
      // Aguarda um frame pra garantir que layout/imagens já renderizaram
      await new Promise<void>((r) => requestAnimationFrame(() => r()));

      // (Opcional) aguardar fontes custom carregarem, se existir suporte
      // @ts-ignore
      if (document?.fonts?.ready) {
        // @ts-ignore
        await document.fonts.ready;
      }

      // iPhone: melhora qualidade
      const scale = 2;

      const canvas = await html2canvas(hiddenRef.current, {
        useCORS: true,
        scale,
        backgroundColor: "#0f0f10",
        scrollX: 0,
        scrollY: -window.scrollY, // evita captura “deslocada” no iPhone
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png", 1.0),
      );

      if (!blob) throw new Error("Falha ao gerar imagem");

      const file = new File([blob], "resumo-leilao.png", { type: "image/png" });

      const hasShare = typeof navigator !== "undefined" && "share" in navigator;
      const hasCanShare =
        typeof navigator !== "undefined" && "canShare" in navigator;

      const canNativeShareFiles =
        hasShare &&
        // Só chama canShare se existir (Safari antigo não tem)
        (!hasCanShare || (navigator as any).canShare?.({ files: [file] }));

      if (canNativeShareFiles) {
        await (navigator as any).share({
          files: [file],
          title: "Resumo do Leilão",
          text: "Confira o resultado do leilão!",
        });
        return;
      }

      // Fallback:
      // iOS: abre em nova aba (aí você usa o botão compartilhar do Safari)
      // Outros: download
      const url = URL.createObjectURL(blob);

      if (isIOS()) {
        window.open(url, "_blank", "noopener,noreferrer");
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.download = "resumo-leilao.png";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      alert("Não foi possível compartilhar a imagem.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="relative group w-full max-w-[560px] mx-auto">
      {/* Versão Visível (4:5 Responsive) */}
      <CartazContent
        props={props}
        className={[
          "rounded-2xl @sm:rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.55)] aspect-[4/5]",
          props.className,
        ].join(" ")}
      />

      {/* Versão Oculta para Capture (1:1 1080px) */}
      <div
        className="fixed top-0 left-0 pointer-events-none opacity-0 overflow-hidden"
        style={{ zIndex: -1 }}
      >
        <div ref={hiddenRef} className="w-[540px] h-[675px] aspect-[4/5]">
          <CartazContent
            props={props}
            className="w-full h-full aspect-[4/5]"
            useProxy={true}
          />
        </div>
      </div>

      {/* Botão de Compartilhar */}
      <div className="absolute bottom-4 left-4 z-20">
        <Button
          onClick={handleShare}
          disabled={isSharing}
          size="icon"
          className="h-12 w-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg transition-transform hover:scale-110"
        >
          {isSharing ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Share2 className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
}
