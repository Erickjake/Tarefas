"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { User, Mail, Lock, Loader2, UserPlus, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CadastroPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setErro] = useState("");

    const router = useRouter();

    // Usamos o tRPC para chamar a nossa rota de cadastro
    const cadastrarMutation = trpc.cadastrarUsuario.useMutation({
        onSuccess: () => {
            // Se der sucesso, mandamos o utilizador para o Login com um aviso (opcional) ou direto
            alert("Conta criada com sucesso! Podes fazer login agora.");
            router.push("/login");
        },
        onError: (error) => {
            setErro(error.message || "Ocorreu um erro ao criar a conta.");
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");

        if (password.length < 3) {
            setErro("A senha deve ter pelo menos 3 caracteres.");
            return;
        }

        // Executa a mutação
        cadastrarMutation.mutate({
            name,
            email,
            password,
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-zinc-100 rounded-3xl overflow-hidden">

                <CardHeader className="space-y-2 text-center pt-8">
                    <CardTitle className="text-3xl font-extrabold tracking-tight text-zinc-900">
                        Crie a sua conta
                    </CardTitle>
                    <CardDescription className="text-zinc-500 text-base">
                        Junte-se a nós e comece a organizar o seu dia.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-5 pt-4">

                        {/* Caixa de Erro */}
                        {erro && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p className="font-medium">{erro}</p>
                            </div>
                        )}

                        {/* Campo: Nome */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="font-semibold text-zinc-700 ml-1">Nome</Label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="O seu nome (opcional)"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={cadastrarMutation.isPending}
                                    className="pl-10 h-12 border-zinc-200 focus-visible:ring-indigo-500 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Campo: E-mail */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-semibold text-zinc-700 ml-1">E-mail</Label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nome@exemplo.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={cadastrarMutation.isPending}
                                    className="pl-10 h-12 border-zinc-200 focus-visible:ring-indigo-500 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Campo: Senha */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="font-semibold text-zinc-700 ml-1">Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={cadastrarMutation.isPending}
                                    className="pl-10 h-12 border-zinc-200 focus-visible:ring-indigo-500 rounded-xl"
                                />
                            </div>
                        </div>

                    </CardContent>

                    <CardFooter className="flex flex-col gap-6 pb-8">

                        {/* Botão de Registar */}
                        <Button
                            type="submit"
                            disabled={cadastrarMutation.isPending || !email || !password}
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-base transition-colors duration-200"
                        >
                            {cadastrarMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    A criar conta...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-5 w-5" />
                                    Criar Conta
                                </>
                            )}
                        </Button>

                        {/* Link para Voltar ao Login */}
                        <div className="text-center text-sm text-zinc-500">
                            Já tem uma conta?{" "}
                            <button
                                type="button"
                                onClick={() => router.push("/login")}
                                className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors outline-none rounded-sm"
                            >
                                Entre aqui
                            </button>
                        </div>

                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
