// Local do arquivo: app/error.tsx

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    // Regista o erro no console para tu (o programador) poderes investigar depois
    useEffect(() => {
        console.error("Erro capturado pelo Next.js:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 text-center">

            {/* Ícone de Alerta */}
            <div className="bg-red-100 text-red-600 p-6 rounded-3xl mb-8">
                <AlertTriangle className="w-16 h-16" />
            </div>

            {/* Mensagem Amigável para o Utilizador */}
            <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight mb-4">
                Ops! Algo deu errado.
            </h1>
            <p className="text-zinc-500 max-w-md mb-10 text-lg">
                Tivemos um problema técnico inesperado do nosso lado. A nossa equipa (tu! 😅) já foi notificada.
            </p>

            {/* O Botão Mágico do Next.js */}
            {/* A função reset() tenta renderizar a página novamente na esperança de que o erro tenha passado */}
            <Button
                onClick={() => reset()}
                size="lg"
                className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl px-8 h-12"
            >
                <RefreshCcw className="w-5 h-5 mr-2" />
                Tentar Novamente
            </Button>

        </div>
    );
}
