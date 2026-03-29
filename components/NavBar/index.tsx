"use client"; // Obrigatório sempre que usamos hooks do React ou NextAuth

import React from "react";
import { useSession } from "next-auth/react"; // Importamos o hook mágico!
import { Button } from "@/components/ui/button";
import UserMenu from "../UserMenu";

export function NavBar() {
    // O NextAuth dá-nos a sessão atual e o status ("loading", "authenticated" ou "unauthenticated")
    const { data: session, status } = useSession();

    const isLoadingUser = status === "loading";
    const user = session?.user; // Se houver sessão, extraímos o user

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">

                {/* Lado Esquerdo: Logo e Links */}
                <div className="flex items-center gap-6 md:gap-10">
                    <a href="/" className="flex items-center space-x-2">
                        <span className="inline-block font-bold text-xl text-primary">TaskMaster</span>
                    </a>

                    <div className="hidden md:flex gap-6 text-sm font-medium">
                        <a href="/tasks" className="transition-colors hover:text-foreground/80 text-foreground">Tarefas</a>
                        <a href="/projects" className="transition-colors hover:text-foreground/80 text-muted-foreground">Projetos</a>
                    </div>
                </div>

                {/* Lado Direito: UserMenu */}
                <div className="flex items-center gap-4">
                    {/* Passamos os dados reais para o nosso componente de Menu */}
                    <UserMenu user={user} isLoadingUser={isLoadingUser} />
                    <Button size="sm" className="hidden sm:flex">Nova Tarefa</Button>
                </div>
            </div>
        </nav>
    );
}