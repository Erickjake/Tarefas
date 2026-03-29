import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, ArrowRight, ShieldCheck } from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">


            {/* CONTEÚDO PRINCIPAL */}
            <main className="flex-1">

                {/* 2. SECÇÃO HERO (A primeira impressão) */}
                <section className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-900 tracking-tight max-w-4xl mx-auto leading-tight">
                        Organiza o teu dia. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                            Conquista os teus objetivos.
                        </span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto">
                        A plataforma de gestão de tarefas mais simples e rápida para manteres a tua vida pessoal e profissional em dia. Sem distrações, apenas resultados.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/cadastro">
                            <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-14 text-lg">
                                Criar a minha conta
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 text-lg border-zinc-200 text-zinc-700 hover:bg-zinc-100">
                                Já tenho conta
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* 3. SECÇÃO DE FUNCIONALIDADES (Porquê usar?) */}
                <section className="bg-white py-24 border-t border-zinc-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-zinc-900">Tudo o que precisas para ser produtivo</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {/* Feature 1 */}
                            <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Rápido e Fluido</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Adiciona tarefas em segundos. A nossa interface foi desenhada para não te fazer perder tempo a navegar por menus complexos.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Sincronização Total</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Organiza as tuas tarefas em listas diárias, semanais ou mensais. Nunca mais te esqueças de um prazo importante.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Seguro e Privado</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Os teus dados são teus. Protegidos com autenticação de ponta e encriptação avançada para tua paz de espírito.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

        </div>
    );
}
