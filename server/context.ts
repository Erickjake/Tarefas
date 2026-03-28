import { prisma } from "../lib/prisma";
import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";

export const createContext = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    let user = null;

    if (token) {
        try {
            // Verificamos o token (usa a mesma SECRET que usaste no login)
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
                userId: number;
            };

            // Aqui está o segredo: já buscamos o usuário completo no banco aqui!
            user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, name: true, email: true },
            });
        } catch (error) {
            // Token inválido ou expirado
            user = null;
        }
    }

    return {
        prisma,
        user, // Agora o 'user' com nome e imagem está no contexto!
    };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
