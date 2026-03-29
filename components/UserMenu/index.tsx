"use client"; // Também precisa ser um Client Component por causa do Dropdown e cliques

import React from "react";
import { signOut } from "next-auth/react"; // Importamos a função de logout
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, CheckSquare } from "lucide-react";

// (Mantém as tuas interfaces TypeScript UserProps e UserMenuComponentProps aqui)

export default function UserMenu({ user, isLoadingUser }: any) { // Ajusta a tipagem conforme fizemos antes

    if (isLoadingUser) {
        return (
            <div className="flex items-center gap-2 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                <div className="h-4 w-20 bg-slate-200 rounded"></div>
            </div>
        );
    }

    // Se não estiver logado, o botão "Entrar" pode redirecionar para a página de login
    if (!user) {
        // Redireciona para a página de login automática do NextAuth
        return (
            <a href="/api/auth/signin">
                <Button variant="outline" size="sm">Entrar</Button>
            </a>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image} alt={user.name} /> {/* NextAuth usa 'image' */}
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* ... (Outros itens do menu) ... */}

                <DropdownMenuSeparator />

                {/* AQUI ESTÁ A MAGIA DO LOGOUT */}
                <DropdownMenuItem
                    className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600"
                    onClick={() => signOut({ callbackUrl: '/' })} // Volta para a Home após sair
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}