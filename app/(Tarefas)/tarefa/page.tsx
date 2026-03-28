'use client'

import { trpc } from "@/lib/trpc";
import { useState } from "react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CriarTarefa() {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");

    // 1. O "utilitário" do tRPC nos permite recarregar dados na tela
    const util = trpc.useUtils();

    // 2. Buscamos as tarefas do banco de dados (Query)
    // Como fixamos o userId como 1 no cadastro, buscamos as tarefas do usuário 1
    const { data: tarefas, isLoading } = trpc.listarTarefas.useQuery({ userId: 1 });

    // 3. A mutação de criar tarefa
    const criarTarefaMutation = trpc.criarTarefa.useMutation({
        onSuccess: (dados) => {
            alert("✨ " + dados.mensagem);
            setTitulo("");
            setDescricao("");
            // MÁGICA: Assim que criar uma nova, avisamos a lista para se atualizar sozinha!
            util.listarTarefas.invalidate();
        },
        onError: (erro) => {
            alert(`Erro: ${erro.message}`);
        }
    });

    const lidarComEnvio = (e: React.FormEvent) => {
        e.preventDefault();
        criarTarefaMutation.mutate({
            titulo: titulo,
            descricao: descricao,
            userId: 1,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4 gap-8">

            {/* --- CARTÃO 1: O FORMULÁRIO (Igual ao que já tínhamos) --- */}
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Crie sua Tarefa</CardTitle>
                    <CardDescription>O que você precisa fazer hoje?</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={lidarComEnvio} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="titulo">Título</Label>
                            <Input
                                id="titulo" placeholder="Ex: Estudar Next.js"
                                value={titulo} onChange={(e) => setTitulo(e.target.value)} required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Textarea
                                id="descricao" placeholder="Detalhes da tarefa..."
                                value={descricao} onChange={(e) => setDescricao(e.target.value)}
                                className="resize-y"
                            />
                        </div>
                        <Button type="submit" className="w-full mt-2" disabled={criarTarefaMutation.isPending}>
                            {criarTarefaMutation.isPending ? "Criando..." : "Criar Tarefa"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* --- CARTÃO 2: A LISTA DE TAREFAS --- */}
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-xl">Suas Tarefas</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Se estiver carregando, mostramos um aviso */}
                    {isLoading ? (
                        <p className="text-center text-slate-500">Carregando tarefas...</p>
                    ) : tarefas && tarefas.length > 0 ? (
                        // Se tiver tarefas, fazemos um "map" para mostrar cada uma delas
                        <ul className="flex flex-col gap-3">
                            {tarefas.map((tarefa) => (
                                <li key={tarefa.id} className="p-3 border rounded-md bg-white shadow-sm flex flex-col gap-1">
                                    <span className="font-semibold text-slate-800">{tarefa.titulo}</span>
                                    {/* Só mostra a descrição se ela existir */}
                                    {tarefa.descricao && (
                                        <span className="text-sm text-slate-500">{tarefa.descricao}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        // Se a lista estiver vazia
                        <p className="text-center text-slate-500">Nenhuma tarefa encontrada. Crie uma acima!</p>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}