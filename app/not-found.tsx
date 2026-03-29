// Local do arquivo: app/not-found.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 text-center">

            {/* Ícone Gigante */}
            <div className="bg-indigo-100 text-indigo-600 p-6 rounded-full mb-8 animate-bounce duration-1000">
                <SearchX className="w-16 h-16" />
            </div>

            {/* Texto de Erro */}
            <h1 className="text-6xl font-extrabold text-zinc-900 tracking-tight mb-2">404</h1>
            <h2 className="text-2xl font-bold text-zinc-700 mb-4">Página não encontrada</h2>
            <p className="text-zinc-500 max-w-md mb-10 text-lg">
                Ops! Parece que te perdeste. A página que estás a tentar aceder não existe ou foi movida.
            </p>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/">
                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-12">
                        <Home className="w-5 h-5 mr-2" />
                        Ir para a Home
                    </Button>
                </Link>
                <Link href="/tarefa">
                    <Button size="lg" variant="outline" className="rounded-xl px-8 h-12 border-zinc-200 text-zinc-700 hover:bg-zinc-100">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Voltar às Tarefas
                    </Button>
                </Link>
            </div>

        </div>
    );
}
