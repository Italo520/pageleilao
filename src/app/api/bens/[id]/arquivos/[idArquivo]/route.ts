import { NextResponse } from "next/server";
import { obterToken } from "@/services/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string; idArquivo: string }> },
) {
    const { id: idBemParam, idArquivo: idArquivoParam } = await params;

    const idBem = parseInt(idBemParam, 10);
    const idArquivo = parseInt(idArquivoParam, 10);

    if (isNaN(idBem) || isNaN(idArquivo)) {
        return NextResponse.json(
            { error: "IDs inválidos para bem ou arquivo" },
            { status: 400 }
        );
    }

    try {
        const token = await obterToken();

        if (!token) {
            return NextResponse.json(
                { error: "Não foi possível autenticar no ERP" },
                { status: 401 }
            );
        }

        const baseUrl = process.env.API_BASE_URL;
        const urlDelete = `${baseUrl}/api/bens/${idBem}/arquivos/${idArquivo}`;

        const res = await fetch(urlDelete, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: token,
                Origin: "https://erp.leiloespb.com.br",
                Referer: "https://erp.leiloespb.com.br/",
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`[API Delete] Error Status: ${res.status}`, errorText);
            return NextResponse.json(
                { error: `Falha ao apagar arquivo no ERP: ${res.statusText}` },
                { status: res.status }
            );
        }

        // A maioria das APIs retorna 204 No Content ou JSON vazio no DELETE
        return NextResponse.json({
            message: "Arquivo apagado com sucesso",
        });

    } catch (error) {
        console.error("Erro interno ao deletar a imagem:", error);
        return NextResponse.json(
            { error: "Erro interno no servidor de proxy." },
            { status: 500 }
        );
    }
}
