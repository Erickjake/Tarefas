"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setErro] = useState("");

    const router = useRouter();

    // Chamada para a nossa mutation de login no tRPC
    const loginMutation = trpc.login.useMutation({
        onSuccess: () => {
            // Se deu certo, o cookie já foi setado pelo servidor!
            router.push("/tarefa"); // Redireciona para a área logada
        },
        onError: (err) => {
            setErro(err.message || "Erro ao fazer login");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        loginMutation.mutate({ email, password });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
                    <CardDescription>
                        Insira o seu e-mail e senha para aceder à sua conta.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {/* Exibe erro se houver */}
                        {erro && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm border border-red-200">
                                {erro}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nome@exemplo.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            type="submit"
                        >
                            {loginMutation.isPending ? "Entrando..." : "Entrar"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}