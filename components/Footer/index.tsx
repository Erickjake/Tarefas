import {
    CheckCircle2,
    GitGraph,   // Se der erro, tenta: GitGraph
    Bird,  // Se der erro, tenta: Bird
    Link  // Se der erro, tenta: Link
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 pt-12 pb-8 mt-auto">
            <div className="max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    {/* Coluna 1: Logo */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 text-blue-600 mb-4">
                            <CheckCircle2 className="w-6 h-6" />
                            <span className="text-xl font-bold text-slate-800 tracking-tight">
                                Minhas<span className="text-blue-600">Tarefas</span>
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Organize o seu dia a dia com simplicidade e eficiência.
                        </p>
                    </div>

                    {/* Coluna 2: Links */}
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Links</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-slate-600 hover:text-blue-600">Funcionalidades</a></li>
                            <li><a href="#" className="text-sm text-slate-600 hover:text-blue-600">Preços</a></li>
                        </ul>
                    </div>

                    {/* Coluna 3: Newsletter (Usando HTML puro com Tailwind) */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="font-semibold text-slate-900 mb-4">Fique por dentro</h4>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Seu melhor e-mail"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                            />
                            <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                Assinar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Linha separadora manual (CSS puro) */}
                <div className="h-[1px] w-full bg-slate-200 my-8" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© 2026 MinhasTarefas. Todos os direitos reservados.</p>
                    <div className="flex gap-4">
                        <GitGraph className="w-4 h-4 cursor-pointer hover:text-blue-600" />
                        <Bird className="w-4 h-4 cursor-pointer hover:text-blue-600" />
                        <Link className="w-4 h-4 cursor-pointer hover:text-blue-600" />
                    </div>
                </div>
            </div>
        </footer>
    );
}