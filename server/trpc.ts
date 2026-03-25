// Local do arquivo: server/trpc.ts

import { initTRPC } from "@trpc/server";

// 1. Inicializamos o tRPC. Isso só deve ser feito UMA VEZ por projeto.
const t = initTRPC.create();

// 2. Exportamos o "router" (roteador) que vai agrupar nossas rotas
export const router = t.router;

// 3. Exportamos a "publicProcedure" (procedimento público).
// É com ela que vamos criar nossas funções que o frontend pode chamar.
export const publicProcedure = t.procedure;
