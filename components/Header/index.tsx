'use client'

import { CheckCircle2, User, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";
// --- NOVA IMPORTAÇÃO DO NEXTAUTH ---
import { useSession, signOut } from "next-auth/react";

export default function Header() {
    const router = useRouter();

    // O NextAuth gerencia tudo isto para nós agora!
    const { data: session, status } = useSession();

    // Variáveis auxiliares para manter a tua lógica igual
    const isLoadingUser = status === "loading";
    const user = session?.user;

    const getInitials = (name?: string | null) => {
        if (!name) return "U"; // "U" de Usuário
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    };

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
            <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2 text-blue-600">
                    <CheckCircle2 className="w-7 h-7" />
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                        Minhas<span className="text-blue-600">Tarefas</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/")}
                        className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
                    >
                        Home
                    </button>
                </div>

                {/* Perfil */}
                <div className="flex items-center gap-4">
                    {isLoadingUser ? (
                        // Skeleton de carregamento suave
                        <span className="text-sm font-medium text-slate-400 animate-pulse">
                            A verificar...
                        </span>
                    ) : user ? (
                        // --- CASO: UTILIZADOR LOGADO ---
                        <>
                            <span className="text-sm font-medium text-slate-600 hidden sm:block">
                                Olá, {user.name || "Usuário"}
                            </span>

                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none">
                                    <Avatar className="cursor-pointer hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 transition-all">
                                        {/* NextAuth usa user.image para a foto */}
                                        <AvatarImage src={user.image || ""} alt={user.name || "avatar"} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel className="flex flex-col">
                                        <span>Minha Conta</span>
                                        <span className="text-xs text-slate-500 font-normal">{user.email}</span>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer gap-2">
                                        <User className="w-4 h-4" />
                                        <span>Meu Perfil</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => router.push("/settings")}>
                                        <Settings className="w-4 h-4" />
                                        <span>Configurações</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />

                                    {/* --- LOGOUT ATUALIZADO --- */}
                                    <DropdownMenuItem
                                        onClick={() => signOut({ callbackUrl: '/login' })}
                                        className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm font-medium">Sair da conta</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        // --- CASO: NÃO LOGADO ---
                        <button
                            onClick={() => router.push("/login")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                        >
                            Entrar
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
