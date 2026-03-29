// Local do arquivo: server/trpc.ts

import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
import { getServerSession } from "next-auth";
// Importante: Ajusta este caminho para onde criaste o route.ts do NextAuth!
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 1. Inicializamos o tRPC.
const t = initTRPC.context<Context>().create();

// 2. Exportamos o "router"
export const router = t.router;

// 3. Exportamos a "publicProcedure"
export const publicProcedure = t.procedure;

// 4. Atualizamos o protectedProcedure para usar o NextAuth
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    // Pede ao NextAuth a sessão atual do utilizador (lê os cookies automaticamente)
    const session = await getServerSession(authOptions);

    // Se não houver sessão ou utilizador, bloqueia o acesso
    if (!session || !session.user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Não autorizado. Precisas de fazer login.",
        });
    }

    // Se passou, injeta os dados do utilizador no contexto do tRPC
    return next({
        ctx: {
            ...ctx,
            // Agora o teu frontend vai ter acesso ao id, email, nome, etc.
            user: session.user,
        },
    });
});
