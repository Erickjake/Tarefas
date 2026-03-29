"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, Loader2, LogIn, AlertCircle } from "lucide-react"; // Adicionámos ícones!

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setErro] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setIsLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setIsLoading(false);

        if (result?.error) {
            setErro("E-mail ou senha incorretos. Tente novamente.");
        } else if (result?.ok) {
            router.push("/tarefa");
            router.refresh();
        }
    };

    return (
        // Fundo suave para contrastar com o cartão branco
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-zinc-100 rounded-3xl overflow-hidden">

                <CardHeader className="space-y-2 text-center pt-8">
                    <CardTitle className="text-3xl font-extrabold tracking-tight text-zinc-900">
                        Bem-vindo de volta
                    </CardTitle>
                    <CardDescription className="text-zinc-500 text-base">
                        Insira as suas credenciais para aceder à conta.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-5 pt-4">

                        {/* Caixa de Erro Refinada */}
                        {erro && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p className="font-medium">{erro}</p>
                            </div>
                        )}

                        {/* Campo de E-mail com Ícone */}
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
                                    disabled={isLoading}
                                    className="pl-10 h-12 border-zinc-200 focus-visible:ring-indigo-500 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Campo de Senha com Ícone */}
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
                                    disabled={isLoading}
                                    className="pl-10 h-12 border-zinc-200 focus-visible:ring-indigo-500 rounded-xl"
                                />
                            </div>
                        </div>

                    </CardContent>

                    <CardFooter className="flex flex-col gap-6 pb-8">

                        {/* Botão de Entrar Gigante e Principal */}
                        <Button
                            type="submit"
                            disabled={isLoading || !email || !password}
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-base transition-colors duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    A entrar...
                                </>
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-5 w-5" />
                                    Entrar
                                </>
                            )}
                        </Button>

                        {/* Link de Registo Moderno */}
                        <div className="text-center text-sm text-zinc-500">
                            Não tem uma conta?{" "}
                            <button
                                type="button" // OBRIGATÓRIO PARA NÃO ENVIAR O FORMULÁRIO
                                onClick={() => router.push("/cadastro")}
                                className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm"
                            >
                                Registe-se agora
                            </button>
                        </div>

                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
