"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Circle, CheckCircle2, Trash2, CalendarCheck2, ListTodo, Type, AlignLeft, CalendarDays, CalendarRange, Calendar } from "lucide-react";

// Definimos um tipo para nos ajudar a não cometer erros de digitação
type Frequencia = "DIARIA" | "SEMANAL" | "MENSAL";

export default function TarefasPage() {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");

    // 1. Novos Estados para controlar a Frequência e as Abas
    const [frequenciaNovaTarefa, setFrequenciaNovaTarefa] = useState<Frequencia>("DIARIA");
    const [abaAtiva, setAbaAtiva] = useState<Frequencia>("DIARIA");

    const utils = trpc.useUtils();
    const { data: tarefas, isLoading } = trpc.listarTarefas.useQuery();

    // 2. Lógica de Filtragem: Só mostramos as tarefas da aba que está selecionada!
    const tarefasDaAba = tarefas?.filter(t => t.frequencia === abaAtiva) || [];
    const tarefasPendentes = tarefasDaAba.filter(t => !t.concluida);
    const tarefasConcluidas = tarefasDaAba.filter(t => t.concluida);

    // Mutações (mantêm-se iguais, só atualizamos a de criar)
    const criarTarefaMutation = trpc.criarTarefa.useMutation({
        onSuccess: () => { setTitulo(""); setDescricao(""); utils.listarTarefas.invalidate(); },
        onError: (erro) => alert(`Erro ao criar: ${erro.message}`)
    });

    const apagarTarefaMutation = trpc.apagarTarefa.useMutation({
        onSuccess: () => utils.listarTarefas.invalidate()
    });

    const alternarStatusMutation = trpc.alternarStatusTarefa.useMutation({
        onSuccess: () => utils.listarTarefas.invalidate()
    });

    const handleAdicionarTarefa = (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo.trim()) return;
        // Agora enviamos também a frequência escolhida!
        criarTarefaMutation.mutate({ titulo, descricao, frequencia: frequenciaNovaTarefa });
    };

    // Card Reutilizável
    const TaskCard = ({ tarefa }: { tarefa: any }) => (
        <Card className={`group border border-zinc-100 transition-all duration-200 hover:shadow-md hover:border-zinc-200 ${tarefa.concluida ? 'bg-zinc-50/50' : 'bg-white'}`}>
            <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                    <button
                        onClick={() => alternarStatusMutation.mutate({ id: tarefa.id, concluida: !tarefa.concluida })}
                        disabled={alternarStatusMutation.isPending}
                        type="button"
                        className="mt-1 outline-none transition-transform active:scale-95"
                    >
                        {tarefa.concluida ? <CheckCircle2 className="w-6 h-6 text-indigo-500" /> : <Circle className="w-6 h-6 text-zinc-300 hover:text-indigo-500" />}
                    </button>
                    <div className={tarefa.concluida ? "line-through text-zinc-400" : ""}>
                        <h3 className={`font-semibold ${tarefa.concluida ? 'text-zinc-500' : 'text-zinc-900'}`}>{tarefa.titulo}</h3>
                        {tarefa.descricao && <p className={`text-sm mt-1.5 ${tarefa.concluida ? 'text-zinc-400' : 'text-zinc-600'}`}>{tarefa.descricao}</p>}
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => apagarTarefaMutation.mutate({ id: tarefa.id })} disabled={apagarTarefaMutation.isPending} className="text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-full">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="max-w-4xl mx-auto p-6 py-12 space-y-10">

                {/* Cabeçalho */}
                <header className="flex items-center justify-between pb-4 border-b border-zinc-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl"><ListTodo className="w-7 h-7" /></div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">O meu Planeamento</h1>
                            <p className="text-zinc-600 mt-1">Organiza a tua vida ao teu ritmo.</p>
                        </div>
                    </div>
                </header>

                {/* Área de Criação Atualizada */}
                <section>
                    <Card className="bg-white shadow-lg shadow-zinc-200/50 border-none rounded-3xl p-4">
                        <CardContent className="p-0 space-y-4">

                            {/* Novo: Seletor de Frequência para a Nova Tarefa */}
                            <div className="flex gap-2">
                                {(["DIARIA", "SEMANAL", "MENSAL"] as Frequencia[]).map((freq) => (
                                    <button
                                        key={freq}
                                        type="button"
                                        onClick={() => setFrequenciaNovaTarefa(freq)}
                                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${frequenciaNovaTarefa === freq
                                                ? "bg-indigo-100 text-indigo-700"
                                                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                                            }`}
                                    >
                                        {freq === "DIARIA" ? "Diária" : freq === "SEMANAL" ? "Semanal" : "Mensal"}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleAdicionarTarefa} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="relative flex-1">
                                    <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <Input placeholder="Título da nova tarefa..." value={titulo} onChange={(e) => setTitulo(e.target.value)} disabled={criarTarefaMutation.isPending} className="pl-10 h-11 border-zinc-200 focus-visible:ring-indigo-500 rounded-xl" />
                                </div>
                                <div className="relative flex-1">
                                    <AlignLeft className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <Input placeholder="Descrição opcional..." value={descricao} onChange={(e) => setDescricao(e.target.value)} disabled={criarTarefaMutation.isPending} className="pl-10 h-11 border-zinc-200 focus-visible:ring-indigo-500 rounded-xl" />
                                </div>
                                <Button type="submit" disabled={criarTarefaMutation.isPending || !titulo.trim()} size="lg" className="h-11 bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6 transition-colors duration-200">
                                    {criarTarefaMutation.isPending ? "A salvar..." : <><Plus className="w-4 h-4 mr-2" /> Adicionar</>}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </section>

                {/* ABAS DE NAVEGAÇÃO */}
                <div className="flex bg-zinc-200/50 p-1 rounded-2xl">
                    {(["DIARIA", "SEMANAL", "MENSAL"] as Frequencia[]).map((aba) => (
                        <button
                            key={aba}
                            onClick={() => setAbaAtiva(aba)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${abaAtiva === aba
                                    ? "bg-white text-indigo-600 shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50"
                                }`}
                        >
                            {aba === "DIARIA" && <Calendar className="w-4 h-4" />}
                            {aba === "SEMANAL" && <CalendarDays className="w-4 h-4" />}
                            {aba === "MENSAL" && <CalendarRange className="w-4 h-4" />}
                            {aba === "DIARIA" ? "Tarefas Diárias" : aba === "SEMANAL" ? "Tarefas Semanais" : "Tarefas Mensais"}
                        </button>
                    ))}
                </div>

                {/* Lista de Tarefas (Mostra apenas as da Aba Ativa) */}
                <main className="space-y-10">
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">A fazer</h2>
                            <Separator className="flex-1 bg-zinc-200" />
                        </div>

                        {isLoading ? (
                            <p className="text-zinc-500 animate-pulse text-center py-8">A carregar as tuas tarefas...</p>
                        ) : tarefasPendentes.length === 0 ? (
                            <div className="text-center py-10 px-6 border-2 border-dashed border-zinc-200 rounded-3xl bg-white/50">
                                <p className="text-zinc-500 font-medium">Não tens tarefas nesta categoria! ✨</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {tarefasPendentes.map((t) => <TaskCard key={t.id} tarefa={t} />)}
                            </div>
                        )}
                    </section>

                    {tarefasConcluidas.length > 0 && (
                        <section className="space-y-4 opacity-80 hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-zinc-600 tracking-tight">Concluídas</h2>
                                <Separator className="flex-1 bg-zinc-100" />
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {tarefasConcluidas.map((t) => <TaskCard key={t.id} tarefa={t} />)}
                            </div>
                        </section>
                    )}
                </main>

            </div>
        </div>
    );
}
