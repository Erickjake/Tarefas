import { prisma } from "../lib/prisma";
import { getServerSession } from "next-auth";
// Ajusta o caminho para onde guardaste as tuas configurações do NextAuth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const createContext = async () => {
    // 1. O NextAuth lê os cookies e valida a sessão automaticamente!
    const session = await getServerSession(authOptions);

    let user = null;

    // 2. Se houver uma sessão válida e um email
    if (session?.user?.email) {
        try {
            // 3. Vamos buscar os dados frescos à base de dados com o Prisma
            user = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { id: true, name: true, email: true },
            });
        } catch (error) {
            console.error(
                "Erro ao procurar o utilizador na base de dados",
                error,
            );
            user = null;
        }
    }

    return {
        prisma,
        user, // O utilizador validado da base de dados!
        session, // Opcional: injetamos também a sessão crua caso precises no futuro
    };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
