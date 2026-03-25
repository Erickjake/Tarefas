// Local do arquivo: server/index.ts

import { z } from "zod";
import { router, publicProcedure } from "./trpc";
import { prisma } from "../lib/prisma"; // Nosso banco de dados!
import bcrypt from "bcryptjs";

// Aqui criamos o roteador principal da nossa aplicação
export const appRouter = router({
    // Criamos uma função chamada "cadastrarUsuario"
    cadastrarUsuario: publicProcedure
        // O Zod (z) valida se o frontend está mandando os dados certos ANTES de rodar o código
        .input(
            z.object({
                name: z.string().optional(),
                email: z.string().email("Digite um email válido"),
                password: z
                    .string()
                    .min(3, "A senha deve ter no mínimo 3 caracteres"),
            }),
        )
        // "mutation" é usado quando vamos ALTERAR ou INSERIR dados no banco
        .mutation(async ({ input }) => {
            // 1. Verificamos se o usuário já existe
            const usuarioExistente = await prisma.user.findUnique({
                where: { email: input.email },
            });

            if (usuarioExistente) {
                // No tRPC, lançamos erros assim:
                throw new Error("Este email já está em uso.");
            }

            // 2. Criptografamos a senha
            const senhaCriptografada = await bcrypt.hash(input.password, 10);

            // 3. Salvamos no banco
            const novoUsuario = await prisma.user.create({
                data: {
                    name: input.name,
                    email: input.email,
                    password: senhaCriptografada,
                },
            });

            // 4. Retornamos o sucesso
            return {
                mensagem: "Usuário cadastrado com sucesso!",
                usuarioId: novoUsuario.id,
            };
        }),

    // Futuramente, adicionaremos "criarTarefa" ou "listarTarefas" aqui!
});

// Exportamos o TIPO do roteador. É isso que dá o "superpoder" ao Frontend saber o que existe no Backend!
export type AppRouter = typeof appRouter;
