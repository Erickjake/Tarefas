// Local do arquivo: app/cadastro/page.tsx

"use client"; // Esta é uma página interativa (tem botões e formulários)

import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function CadastroPage() {
    // 1. Criamos os "estados" (memória temporária) para guardar o que o usuário digita
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    // 2. A MÁGICA DO tRPC!
    // Veja como ele sugere "cadastrarUsuario" automaticamente se você digitar trpc.
    const cadastroMutation = trpc.cadastrarUsuario.useMutation({
        onSuccess: (dados) => {
            // Se der tudo certo no backend, este código roda!
            alert(dados.mensagem);
            // Aqui poderíamos redirecionar para a tela de Login
        },
        onError: (erro) => {
            // Se o servidor der erro (ex: email já existe), ele cai aqui!
            alert(`Erro: ${erro.message}`);
        }
    });

    // 3. Função que roda quando clicamos em "Cadastrar"
    const lidarComEnvio = (e: React.FormEvent) => {
        e.preventDefault(); // Evita que a página recarregue

        // Chamamos o backend enviando os dados!
        cadastroMutation.mutate({
            name: nome,
            email: email,
            password: senha,
        });
    };

    // 4. O visual da página (HTML)
    return (
        <main style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <h2>Crie sua Conta</h2>

            <form onSubmit={lidarComEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                <input
                    type="text" placeholder="Seu Nome" required
                    value={nome} onChange={(e) => setNome(e.target.value)}
                    style={{ padding: '10px' }}
                />

                <input
                    type="email" placeholder="Seu E-mail" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    style={{ padding: '10px' }}
                />

                <input
                    type="password" placeholder="Sua Senha" required
                    value={senha} onChange={(e) => setSenha(e.target.value)}
                    style={{ padding: '10px' }}
                />

                <button
                    type="submit"
                    disabled={cadastroMutation.isPending} // Desativa o botão enquanto carrega
                    style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', cursor: 'pointer' }}
                >
                    {cadastroMutation.isPending ? "Cadastrando..." : "Cadastrar"}
                </button>

            </form>
        </main>
    );
}