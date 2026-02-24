import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fontes Premium
const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;600;800&display=swap');
`;

type Props = {
  className?: string;
  percentualVendido?: number;
  lotesDisponibilizados?: number;
  lotesVendidos?: number;
  condicionais?: number;
  arrecadacao?: string;
  dataTexto?: string;
  diaSemanaTexto?: string;
  siteTexto?: string;
  tituloDireita?: string;
  subtituloDireita?: string;
  fundoUrl?: string;
  logoUrl?: string;
};

function DonutPercentual({
  percentual,
  tamanho = 320,
  espessura = 28,
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
    <div className="relative flex justify-center items-center w-full aspect-square">
      <svg viewBox={`0 0 ${tamanho} ${tamanho}`} className="w-full h-full drop-shadow-[0_0_30px_rgba(202,138,4,0.2)]">
        <circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth={espessura}
        />
        <g transform={`rotate(-90 ${tamanho / 2} ${tamanho / 2})`}>
          <circle
            cx={tamanho / 2}
            cy={tamanho / 2}
            r={raio}
            fill="none"
            stroke="url(#premiumGoldGradient)"
            strokeWidth={espessura}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="premiumGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
          </defs>
        </g>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none font-['Bodoni_Moda']">
        <div className="flex items-baseline">
          <span className="text-[96px] font-black text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)] leading-none italic">
            {pct}
          </span>
          <span className="text-[36px] font-black text-[#dfb555] ml-[4px] italic">%</span>
        </div>
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
  const percentualVendido = props.percentualVendido ?? 78;
  const lotesDisponibilizados = props.lotesDisponibilizados ?? 628;
  const lotesVendidos = props.lotesVendidos ?? 0;
  const arrecadacao = props.arrecadacao ?? "R$ 2.110.500,00";
  const dataTexto = props.dataTexto ?? "26 DE FEVEREIRO 2026";
  const siteTexto = props.siteTexto ?? "LEILOESPB.COM.BR";
  const tituloDireita = props.tituloDireita ?? "LEILOADO";
  const subtituloDireita = props.subtituloDireita ?? "TOKIO MARINE SEGURADORA";

  const getProxiedUrl = (url?: string) => {
    if (!url) return undefined;
    if (!useProxy) return url;
    if (url.startsWith("/api/image-proxy") || url.startsWith("data:")) return url;
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  };

  const logoUrl = getProxiedUrl(props.logoUrl);

  return (
    <div
      className={[
        "relative w-[720px] h-[982px] overflow-hidden bg-gradient-to-br from-[#2c2c2d] via-[#1a1a1b] to-[#0e0e0e] text-white font-['Jost']",
        className,
      ].join(" ")}
    >
      <style dangerouslySetInnerHTML={{ __html: FONT_IMPORT }} />

      {/* Marca d'água de Fundo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
        <span className="text-[200px] font-black text-white tracking-tighter select-none whitespace-nowrap uppercase">
          <img src="/icons/icon-512x512.png" alt="Watermark" className="w-[300px] h-auto grayscale brightness-200" />
        </span>
      </div>

      {/* Header - Topo Esquerdo (Data e Site) */}
      <div className="absolute top-[48px] left-0 flex flex-col z-10">
        <div className="flex items-center">
          {/* Barra lateral dourada */}
          <div className="w-[12px] h-[48px] bg-[#dfb555] mr-[24px] shadow-[4px_0_20px_rgba(223,181,85,0.4)]"></div>
          <h1 className="text-[32px] font-['Bodoni_Moda'] font-black text-[#dfb555] tracking-tight drop-shadow-lg italic uppercase">
            {dataTexto}
          </h1>
        </div>
        <p className="text-gray-300/80 ml-[36px] mt-[4px] text-[12px] tracking-[0.3em] font-bold uppercase">
          {siteTexto}
        </p>
      </div>

      {/* Header - Topo Direito (Logo Comitente) */}
      <div className="absolute top-[40px] right-[40px] z-10 flex items-center">
        <div className="bg-[#1a1a1b]/80 backdrop-blur-xl rounded-[16px] flex items-center py-[10px] px-[24px] shadow-2xl border-l-[4px] border-[#dfb555] border-white/5 font-['Jost']">
          {logoUrl ? (
            <img src={logoUrl} alt="Comitente" className="w-[40px] h-[40px] rounded-[12px] object-contain mr-[16px] bg-white/5 p-[4px]" />
          ) : (
            <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-[#dfb555] to-[#a6802e] mr-[16px] shadow-inner flex items-center justify-center font-bold text-black uppercase text-[12px]">
              {subtituloDireita?.charAt(0)}
            </div>
          )}
          <div className="flex flex-col justify-center">
            <span className="text-white font-black text-[14px] leading-tight tracking-wide uppercase">
              {subtituloDireita?.split(' ').slice(0, 2).join(' ')}
            </span>
            <span className="text-gray-500 text-[10px] leading-tight font-black tracking-[0.2em] uppercase mt-[2px]">
              {subtituloDireita?.split(' ').slice(2).join(' ') || "SEGURADORA"}
            </span>
          </div>
        </div>
      </div>

      {/* Seção Central (Gráfico e Título) */}
      <div className="absolute top-[180px] bottom-[300px] left-0 right-0 flex flex-col items-center justify-center z-10 pointer-events-none px-[48px]">
        <div className="relative flex-1 w-full flex items-center justify-center">
          <div className="w-[320px] h-[320px] flex items-center justify-center">
            <DonutPercentual percentual={percentualVendido} tamanho={320} espessura={28} />
          </div>
        </div>
        <h2
          className="text-[96px] font-['Bodoni_Moda'] font-black text-[#dfb555] mt-[16px] tracking-tighter drop-shadow-2xl italic leading-none uppercase shrink-0"
          style={{ textShadow: "0 5px 20px rgba(0,0,0,0.8)" }}>
          {tituloDireita}
        </h2>
      </div>

      {/* Seção de Métricas */}
      <div className="absolute bottom-[128px] left-[40px] right-[40px] flex flex-col gap-[24px] z-10">
        <LinhaMetricaDashboard label="LOTES DISPONIBILIZADOS" valor={String(lotesDisponibilizados)} />
        <LinhaMetricaDashboard label="LOTES VENDIDOS" valor={String(lotesVendidos)} />
        <LinhaMetricaDashboard label="ARRECADAÇÃO" valor={arrecadacao} />
      </div>

      {/* Logo Inferior Direita (Casa de Leilões) */}
      <div className="absolute bottom-[40px] right-[40px] z-10 flex items-center gap-[20px]">
        <CloverLogo />
        <div className="flex flex-col items-start justify-center">
          <span className="text-[#dfb555] font-black text-[30px] leading-none tracking-[0.1em] drop-shadow-xl font-['Bodoni_Moda'] italic uppercase">
            LEILÕES PB
          </span>
          <span className="text-gray-300/60 text-[10px] tracking-[0.4em] font-black mt-[8px] uppercase font-['Jost']">
            Casa de Leilões
          </span>
        </div>
      </div>
    </div>
  );
}

function LinhaMetricaDashboard({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex items-baseline text-[20px] font-black text-white w-full tracking-wider group font-['Jost']">
      <span className="flex-shrink-0 uppercase opacity-90">{label}</span>
      <div className="flex-grow border-b-[3px] border-dotted border-white/20 mx-[16px] mb-[8px] h-0"></div>
      <span className="text-[#dfb555] text-[28px] drop-shadow-xl font-black whitespace-nowrap">{valor}</span>
    </div>
  );
}

function CloverLogo() {
  return (
    <div className="grid grid-cols-2 gap-[3px] w-[56px] h-[56px] opacity-100 drop-shadow-[0_0_15px_rgba(223,181,85,0.3)] transform rotate-45 scale-90">
      <div className="bg-gradient-to-br from-[#dfb555] to-[#a6802e] rounded-tl-full rounded-br-full shadow-lg"></div>
      <div className="bg-gradient-to-bl from-[#dfb555] to-[#a6802e] rounded-tr-full rounded-bl-full shadow-lg"></div>
      <div className="bg-gradient-to-bl from-[#dfb555] to-[#a6802e] rounded-tr-full rounded-bl-full shadow-lg"></div>
      <div className="bg-gradient-to-br from-[#dfb555] to-[#a6802e] rounded-tl-full rounded-br-full shadow-lg"></div>
    </div>
  );
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export default function CartazLeilaoResumo(props: Props) {
  const [isSharing, setIsSharing] = useState(false);
  const [scale, setScale] = useState(1);
  const hiddenRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calcula a escala exata para caber no modal automaticamente
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;

      const TARGET_WIDTH = 720;
      const TARGET_HEIGHT = 982;
      const PADDING = 32; // Respiro interno

      if (width === 0 || height === 0) return;

      const scaleX = (width - PADDING) / TARGET_WIDTH;
      const scaleY = (height - PADDING) / TARGET_HEIGHT;

      const finalScale = Math.min(scaleX, scaleY);
      setScale(finalScale > 0 ? finalScale : 0.1);
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleShare = async () => {
    if (!hiddenRef.current) return;
    setIsSharing(true);

    try {
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      // @ts-ignore
      if (document?.fonts?.ready) await document.fonts.ready;

      const scaleCapture = 2.0;

      const canvas = await html2canvas(hiddenRef.current, {
        useCORS: true,
        scale: scaleCapture,
        backgroundColor: "#0c0a09",
        scrollX: 0,
        scrollY: 0,
        logging: false,
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png", 1.0),
      );

      if (!blob) throw new Error("Falha ao gerar imagem");

      const file = new File([blob], "leiloes-pb-premium-summary.png", { type: "image/png" });
      const hasShare = typeof navigator !== "undefined" && "share" in navigator;
      const canShareFiles = hasShare && (navigator as any).canShare?.({ files: [file] });

      if (canShareFiles) {
        await (navigator as any).share({
          files: [file],
          title: "Premium Auction Results",
        });
        return;
      }

      const url = URL.createObjectURL(blob);
      if (isIOS()) {
        window.open(url, "_blank", "noopener,noreferrer");
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.download = "leiloes-pb-premium-summary.png";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      alert("Não foi possível processar o compartilhamento.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[400px]">

      {/* Visible Interactive Version */}
      <div ref={containerRef} className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">

        {/* ENVELOPE DINÂMICO: Garante que o flexbox reserve exatamente o espaço escalado */}
        <div
          className="relative shrink-0 transition-all duration-200"
          style={{ width: 720 * scale, height: 982 * scale }}
        >
          {/* Elemento real com o scale configurado para origem Top Left */}
          <div
            style={{
              width: "720px",
              height: "982px",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            className="absolute top-0 left-0 shadow-[0_40px_120px_rgba(0,0,0,0.8)] rounded-3xl border border-white/5 overflow-hidden"
          >
            <CartazContent props={props} />
          </div>
        </div>

        {/* Luxury Floating Share Button */}
        <div className="absolute bottom-4 left-4 z-20 group/btn">
          <div className="absolute inset-0 bg-[#ca8a04]/40 rounded-3xl blur-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          <Button
            onClick={handleShare}
            disabled={isSharing}
            size="icon"
            className="h-14 w-14 rounded-3xl bg-white/5 hover:bg-[#ca8a04] backdrop-blur-2xl text-white shadow-2xl transition-all duration-300 hover:scale-110 border border-white/10 group-active/btn:scale-95"
          >
            {isSharing ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : (
              <Share2 className="h-7 w-7 text-[#ca8a04] group-hover/btn:text-white transition-colors" />
            )}
          </Button>
        </div>
      </div>

      {/* Hidden Capture Buffer (Locked 720x982) - Sempre Perfeito para o Canvas */}
      <div className="fixed top-0 left-0 pointer-events-none opacity-0 overflow-hidden" style={{ zIndex: -100 }}>
        <div ref={hiddenRef} className="w-[720px] h-[982px]">
          <CartazContent props={props} useProxy={true} />
        </div>
      </div>
    </div>
  );
}