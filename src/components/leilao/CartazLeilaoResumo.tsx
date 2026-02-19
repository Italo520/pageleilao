import React from "react";

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
    tamanho = 210,
    espessura = 22,
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
        <div className="relative grid place-items-center">
            <svg width={tamanho} height={tamanho} viewBox={`0 0 ${tamanho} ${tamanho}`}>
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
                <div className="grid place-items-center rounded-full bg-black/65 px-7 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
                    <div className="text-5xl font-extrabold tracking-tight text-white">
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
    valorDestaque = false,
}: {
    label: string;
    valor: string;
    valorDestaque?: boolean;
}) {
    return (
        <div className="flex items-end gap-3">
            <div className="min-w-[220px] text-lg font-extrabold uppercase tracking-wide text-white">
                {label}
            </div>

            <div className="mb-[8px] h-[1px] flex-1 border-b border-dotted border-white/35" />

            <div
                className={[
                    "text-4xl font-extrabold leading-none tabular-nums",
                    valorDestaque ? "text-[#d9b55b]" : "text-[#d9b55b]",
                ].join(" ")}
            >
                {valor}
            </div>
        </div>
    );
}

export default function CartazLeilaoResumo(props: Props) {
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

    const fundoUrl = props.fundoUrl; // opcional
    const logoUrl = props.logoUrl; // opcional

    return (
        <div
            className={[
                "relative w-full max-w-[560px] overflow-hidden rounded-3xl",
                "bg-[#0f0f10] text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)]",
                "aspect-[4/5]",
                props.className ?? "",
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

            {/* Conteúdo */}
            <div className="relative h-full p-8">
                {/* Topo */}
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <div className="text-6xl font-black uppercase tracking-wide">
                            <span className="bg-gradient-to-r from-[#f3dda0] via-[#d9b55b] to-[#b8862b] bg-clip-text text-transparent">
                                LEILÃO
                            </span>
                        </div>

                        <div className="mt-2 text-3xl font-extrabold uppercase tracking-wide">
                            {dataTexto}
                        </div>
                        <div className="mt-1 text-2xl uppercase tracking-widest text-white/40">
                            {diaSemanaTexto}
                        </div>
                    </div>

                    <div className="pt-2 text-sm tracking-[0.3em] text-white/45">
                        {siteTexto}
                    </div>
                </div>

                {/* Miolo */}
                <div className="mt-8 grid grid-cols-12 gap-6">
                    {/* Donut */}
                    <div className="col-span-5">
                        <div className="mt-8">
                            <DonutPercentual percentual={percentualVendido} />
                        </div>
                    </div>

                    {/* Direita: status + seguradora */}
                    <div className="col-span-7 flex flex-col items-start justify-center">
                        <div className="text-6xl font-black uppercase tracking-wide">
                            {tituloDireita}
                        </div>
                        <div className="mt-1 text-sm font-semibold uppercase tracking-[0.45em] text-white/55">
                            {subtituloDireita}
                        </div>

                        {/* Caixa logo (substituível) */}
                        <div className="mt-5 w-full max-w-[360px] rounded-2xl bg-white/92 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                            {logoUrl ? (
                                // se você usar Next/Image, troque por <Image ... fill />
                                <img
                                    src={logoUrl}
                                    alt="Logo seguradora"
                                    className="h-14 w-auto"
                                />
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 shadow-inner" />
                                    <div className="leading-tight text-black">
                                        <div className="text-xl font-black uppercase">TOKIO MARINE</div>
                                        <div className="text-sm font-semibold uppercase opacity-70">
                                            SEGURADORA
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Métricas */}
                <div className="mt-10 space-y-5">
                    <LinhaMetrica
                        label="LOTES DISPONIBILIZADOS"
                        valor={String(lotesDisponibilizados).padStart(2, "0")}
                    />
                    <LinhaMetrica
                        label="LOTES VENDIDOS"
                        valor={String(lotesVendidos).padStart(2, "0")}
                    />
                    <LinhaMetrica
                        label="CONDICIONAIS"
                        valor={String(condicionais).padStart(2, "0")}
                    />

                    <div className="pt-2">
                        <div className="flex items-end gap-3">
                            <div className="min-w-[220px] text-lg font-extrabold uppercase tracking-wide text-white">
                                ARRECADAÇÃO
                            </div>
                            <div className="mb-[8px] h-[1px] flex-1 border-b border-dotted border-white/35" />
                            <div className="text-4xl font-black text-[#d9b55b]">
                                {arrecadacao}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rodapé / marca (placeholder) */}
                <div className="absolute bottom-6 right-8 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl border border-[#d9b55b]/45 bg-[#d9b55b]/10" />
                    <div>
                        <div className="text-2xl font-black tracking-widest text-[#d9b55b]">
                            LEILÕES PB
                        </div>
                        <div className="text-xs font-semibold uppercase tracking-[0.45em] text-[#d9b55b]/70">
                            CASA DE LEILÕES
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
