// Local do arquivo: server/trpc.ts

import { cookies } from "next/headers";
import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
import jwt from "jsonwebtoken";

// 1. Inicializamos o tRPC. Isso só deve ser feito UMA VEZ por projeto.
const t = initTRPC.context<Context>().create();

// 2. Exportamos o "router" (roteador) que vai agrupar nossas rotas
export const router = t.router;

// 3. Exportamos a "publicProcedure" (procedimento público).
// É com ela que vamos criar nossas funções que o frontend pode chamar.
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    const cookieStore = await cookies();
    const token = await cookieStore.get("auth-token")?.value;
    if (!token) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Não autorizado",
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: number;
        };
        return next({
            ctx: {
                ...ctx,
                user: { id: decoded.userId },
            },
        });
    } catch (err) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Não autorizado",
        });
    }
});
