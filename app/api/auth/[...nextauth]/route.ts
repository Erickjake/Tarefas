import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // Ajusta o caminho se o teu lib/prisma estiver noutro local

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credenciais",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "nome@exemplo.com",
                },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {
                // 0. Verifica se o utilizador preencheu tudo
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Por favor, preenche todos os campos.");
                }

                // 1. Procura o utilizador na base de dados (Prisma)
                const usuarioExistente = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!usuarioExistente) {
                    throw new Error(
                        "Nenhum utilizador encontrado com este e-mail.",
                    );
                }

                // 2. Compara a senha digitada com a senha encriptada guardada no banco
                const senhaCorreta = await bcrypt.compare(
                    credentials.password,
                    usuarioExistente.password,
                );

                if (!senhaCorreta) {
                    throw new Error("A senha está incorreta.");
                }

                // 3. Se tudo estiver correto, devolvemos os dados para a sessão!
                // O NextAuth prefere que o ID seja sempre uma string
                return {
                    id: String(usuarioExistente.id),
                    name: usuarioExistente.name,
                    email: usuarioExistente.email,
                    // image: usuarioExistente.image // Podes adicionar isto se tiveres avatar no banco
                };
            },
        }),
    ],
    pages: {
        signIn: "/login", // Diz ao NextAuth: "Usa a MINHA página de login!"
        error: "/login", // Se houver erro, manda de volta para o login para mostrarmos a mensagem vermelha
    },
    callbacks: {
        // 1. O callback do JWT agora recebe o 'trigger' e a 'session'
        async jwt({ token, user, trigger, session }) {
            // Quando o utilizador faz login pela primeira vez
            if (user) {
                token.id = user.id;
            }

            // A MÁGICA AQUI: Se o frontend chamar a função update(), atualizamos o token!
            if (trigger === "update" && session?.name) {
                token.name = session.name;
            }

            return token;
        },

        // 2. Quando o frontend pede a sessão, garantimos que ele recebe os dados atualizados do token
        async session({ session, token }) {
            if (session.user) {
                // Sincronizamos o ID
                session.user.id = token.id as string;

                // Sincronizamos o Nome atualizado
                if (token.name) {
                    session.user.name = token.name as string;
                }
            }
            return session;
        },
    },
   session: {
    strategy: "jwt",
    // Tempo máximo que a sessão dura (Ex: 30 dias)
    maxAge: 30 * 24 * 60 * 60,

    // Tempo para renovar o token (Ex: 24 horas)
    // Se o utilizador abrir o site e o token tiver mais de 24h, o NextAuth
    // gera um novo JWT automaticamente, estendendo a sessão para mais 30 dias!
    updateAge: 24 * 60 * 60,
  },
    secret: process.env.NEXTAUTH_SECRET || "um_segredo_muito_forte_aqui",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
