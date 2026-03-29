"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { trpc } from "@/lib/trpc";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Adicionámos o ícone "Key" (Chave) para a senha
import { UserCircle, Mail, Save, Settings, Trash2Icon, Key } from "lucide-react";

export default function SettingsPage() {
    const { data: session, update } = useSession();

    // 1. Os nossos estados (agora com a nova senha)
    const [nome, setNome] = useState("");
    const [novaSenha, setNovaSenha] = useState("");

    useEffect(() => {
        if (session?.user?.name && !nome) {
            setTimeout(() => {
                setNome(session.user.name || "");
            }, 0);
        }
    }, [session, nome]);

    const atualizarPerfilMutation = trpc.atualizarPerfil.useMutation({
        onSuccess: async () => {
            await update({ name: nome });

            // 2. Limpamos o campo da senha depois de salvar com sucesso!
            setNovaSenha("");
            alert("Perfil atualizado com sucesso!");
        },
        onError: (erro) => {
            alert(`Erro ao atualizar perfil: ${erro.message}`);
        }
    });

    const deletarUserMutation = trpc.deletarUser.useMutation({
        onSuccess: async () => {
            alert("A tua conta foi apagada com sucesso. Até à próxima!");
            await signOut({ callbackUrl: "/login" });
        },
        onError: (erro) => {
            alert(`Erro ao deletar conta: ${erro.message}`);
        }
    });

    // 3. A Lógica de Salvar Inteligente
    const handleSalvarPerfil = () => {
        if (!nome.trim()) return;

        // Validamos se a senha tem pelo menos 3 caracteres (como definimos no Zod do back-end)
        if (novaSenha.trim().length > 0 && novaSenha.trim().length < 3) {
            alert("A nova senha deve ter pelo menos 3 caracteres.");
            return;
        }

        // Preparamos os dados a enviar. Se o utilizador não escreveu senha, enviamos só o nome.
        const dadosAEnviar: { nome: string; password?: string } = { nome: nome };

        if (novaSenha.trim().length >= 3) {
            dadosAEnviar.password = novaSenha;
        }

        atualizarPerfilMutation.mutate(dadosAEnviar);
    };

    const handleDeletarUser = () => {
        const confirmacao = window.confirm(
            "Tens a certeza absoluta que queres apagar a tua conta? Esta ação não pode ser revertida e as tuas tarefas serão apagadas."
        );
        if (confirmacao) {
            deletarUserMutation.mutate();
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="max-w-2xl mx-auto p-6 py-12 space-y-8">

                <header className="flex items-center gap-3 pb-4 border-b border-zinc-200">
                    <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
                        <Settings className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">Configurações</h1>
                        <p className="text-zinc-600 mt-1">Gere a tua conta e preferências.</p>
                    </div>
                </header>

                <Card className="border-none shadow-lg shadow-zinc-200/50 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white border-b border-zinc-100 pb-6">
                        <CardTitle className="text-xl flex items-center gap-2 text-zinc-800">
                            <UserCircle className="w-5 h-5 text-indigo-500" />
                            Dados do Perfil
                        </CardTitle>
                        <CardDescription>
                            Como gostarias de ser chamado e como entras na aplicação?
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="bg-white pt-6">
                        <form className="space-y-6">

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700 ml-1">E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <Input
                                        type="email"
                                        value={session?.user?.email || "A carregar..."}
                                        disabled
                                        className="pl-10 bg-zinc-50 border-zinc-200 text-zinc-500 rounded-xl cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700 ml-1">Nome de Exibição</label>
                                <div className="relative">
                                    <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <Input
                                        placeholder="O teu nome..."
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        disabled={atualizarPerfilMutation.isPending || deletarUserMutation.isPending}
                                        className="pl-10 border-zinc-200 focus-visible:ring-indigo-500 rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* 4. O NOVO CAMPO DA SENHA */}
                            <div className="space-y-2 border-t border-zinc-100 pt-6 mt-6">
                                <label className="text-sm font-medium text-zinc-700 ml-1">Nova Senha</label>
                                <div className="relative">
                                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <Input
                                        type="password"
                                        placeholder="Deixa em branco para não alterar..."
                                        value={novaSenha}
                                        onChange={(e) => setNovaSenha(e.target.value)}
                                        disabled={atualizarPerfilMutation.isPending || deletarUserMutation.isPending}
                                        className="pl-10 border-zinc-200 focus-visible:ring-indigo-500 rounded-xl"
                                    />
                                </div>
                                <p className="text-xs text-zinc-500 ml-1">No mínimo 3 caracteres. Deixa este campo vazio se quiseres manter a tua senha atual.</p>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-4 border-t border-zinc-100 mt-6">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    disabled={deletarUserMutation.isPending || atualizarPerfilMutation.isPending}
                                    onClick={handleDeletarUser}
                                    className="rounded-xl px-6"
                                >
                                    {deletarUserMutation.isPending ? "A apagar..." : <><Trash2Icon className="w-4 h-4 mr-2" />Apagar Conta</>}
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleSalvarPerfil}
                                    // Só desativamos se o botão estiver a carregar ou se o nome estiver vazio.
                                    // Retiramos a regra de "só deixar gravar se mudou de nome" para permitir que grave só a senha!
                                    disabled={atualizarPerfilMutation.isPending || !nome.trim()}
                                    className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6"
                                >
                                    {atualizarPerfilMutation.isPending ? "A guardar..." : <><Save className="w-4 h-4 mr-2" />Guardar Alterações</>}
                                </Button>
                            </div>

                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
