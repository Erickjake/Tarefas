// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Envolvemos a nossa lógica com o "withAuth" do NextAuth
export default withAuth(
    function proxy(req) {
        // 1. O NextAuth coloca os dados do utilizador dentro de req.nextauth.token
        const token = req.nextauth.token;
        const url_atual = req.nextUrl.pathname;

        // 2. Se já está logado e tenta ir para o login ou cadastro, manda para as tarefas
        if (token && (url_atual === "/login" || url_atual === "/cadastro")) {
            return NextResponse.redirect(new URL("/tarefa", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            // Esta função decide se o utilizador está "Autorizado" a continuar
            authorized: ({ req, token }) => {
                const url_atual = req.nextUrl.pathname;

                // Se tentar aceder à dashboard (/tarefa) sem token, barra o acesso (retorna false)
                // O NextAuth redireciona automaticamente para a página de login!
                if (url_atual.startsWith("/tarefa") && !token) {
                    return false;
                }

                // Para qualquer outra rota (como a Home, login, etc), permite continuar
                return true;
            },
        },
    },
);

// Define quais rotas o middleware deve vigiar para não desperdiçar processamento
export const config = {
    matcher: ["/tarefa/:path*", "/login", "/cadastro"],
};
