// Local do arquivo: server/index.ts

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./trpc";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { da } from "zod/v4/locales";
// Repara que apagámos o jsonwebtoken e os cookies das importações!

export const appRouter = router({
    // --- 1. CRIAR CONTA (Mantém-se público para qualquer um se registar) ---
    cadastrarUsuario: publicProcedure
        .input(
            z.object({
                name: z.string().optional(),
                email: z.string().email("Digite um email válido"),
                password: z
                    .string()
                    .min(3, "A senha deve ter no mínimo 3 caracteres"),
            }),
        )
        .mutation(async ({ input }) => {
            const usuarioExistente = await prisma.user.findUnique({
                where: { email: input.email },
            });

            if (usuarioExistente) {
                throw new Error("Este email já está em uso.");
            }

            const senhaCriptografada = await bcrypt.hash(input.password, 10);

            const novoUsuario = await prisma.user.create({
                data: {
                    name: input.name,
                    email: input.email,
                    password: senhaCriptografada,
                },
            });

            return {
                mensagem: "Usuário cadastrado com sucesso!",
                usuarioId: novoUsuario.id,
            };
        }),
       atualizarPerfil: protectedProcedure
        .input(
            z.object({
                // 1. Mudamos aqui de 'name' para 'nome' para combinar com o Frontend
                name: z.string().optional(),
                email: z.string().email("Digite um email válido").optional(),
                password: z
                    .string()
                    .min(3, "A senha deve ter no mínimo 3 caracteres")
                    .optional(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const dadosAtualizacao: any = {};

            // 2. Mapeamos o "input.name    " do frontend para o "name" do Prisma
            if (input.name) dadosAtualizacao.name = input.name;

            if (input.email) dadosAtualizacao.email = input.email;

            if (input.password) {
                const senhaCriptografada = await bcrypt.hash(input.password, 10);
                dadosAtualizacao.password = senhaCriptografada;
            }

            await prisma.user.update({
                where: { id: Number(ctx.user.id) },
                data: dadosAtualizacao,
            });

            return { mensagem: "Dados do usuário atualizados com sucesso!" };
        }),

        deletarUser: protectedProcedure
        .mutation(async ({ ctx }) => {
            await prisma.user.delete({
                where: { id: Number(ctx.user.id) },
            });

            return { mensagem: "Usuário deletado com sucesso!" };
        }),
    // --- 2. CRIAR TAREFA (Protegido: só logados) ---
    criarTarefa: protectedProcedure
        .input(
            z.object({
                titulo: z
                    .string()
                    .min(1, "O título da tarefa não pode estar vazio"),
                descricao: z.string().optional(),
                // Adicionamos a validação da frequência aqui!
                frequencia: z
                    .enum(["DIARIA", "SEMANAL", "MENSAL"])
                    .default("DIARIA"),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const novaTarefa = await prisma.tarefa.create({
                data: {
                    titulo: input.titulo,
                    descricao: input.descricao,
                    frequencia: input.frequencia, // Guardamos no banco
                    userId: Number(ctx.user.id),
                },
            });

            return { mensagem: "Tarefa adicionada!", tarefa: novaTarefa };
        }),
    // --- 3. LISTAR TAREFAS (Protegido e Seguro) ---
    listarTarefas: protectedProcedure // Mudámos de public para protected!
        // Removemos o .input() porque não precisamos que o frontend nos diga quem é o usuário.
        // O servidor já sabe quem é através do cookie de sessão (NextAuth).
        .query(async ({ ctx }) => {
            const tarefas = await prisma.tarefa.findMany({
                where: {
                    userId: Number(ctx.user.id), // Busca apenas as tarefas deste utilizador
                },
                orderBy: {
                    id: "desc",
                },
            });

            return tarefas;
        }),
    alternarStatusTarefa: protectedProcedure
        .input(
            z.object({
                id: z.number(), // O ID da tarefa que queremos alterar
                concluida: z.boolean(), // O novo status (verdadeiro ou falso)
            }),
        )
        .mutation(async ({ input, ctx }) => {
            // Atualizamos a tarefa, mas garantimos que ela pertence ao usuário logado!
            const tarefaAtualizada = await prisma.tarefa.updateMany({
                where: {
                    id: input.id,
                    userId: Number(ctx.user.id), // Segurança extra!
                },
                data: {
                    concluida: input.concluida,
                },
            });

            return { sucesso: true, atualizados: tarefaAtualizada.count };
        }),

    // --- 5. APAGAR TAREFA ---
    apagarTarefa: protectedProcedure
        .input(
            z.object({
                id: z.number(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            // Apagamos a tarefa garantindo que é do dono correto
            const tarefaApagada = await prisma.tarefa.deleteMany({
                where: {
                    id: input.id,
                    userId: Number(ctx.user.id), // Segurança: só apaga se for do usuário logado!
                },
            });

            return { sucesso: true, apagados: tarefaApagada.count };
        }),
});

export type AppRouter = typeof appRouter;
