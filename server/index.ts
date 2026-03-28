// Local do arquivo: server/index.ts

import { z } from "zod";
import * as jwt from "jsonwebtoken";
import { router, publicProcedure, protectedProcedure } from "./trpc";
import { prisma } from "../lib/prisma"; // Nosso banco de dados!
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

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
    getMe: protectedProcedure.query(async ({ ctx }) => {
        // 1. Usamos o ID que está no contexto (vindo do token)
        // para buscar o usuário completo no Prisma
        const usuarioCompleto = await prisma.user.findUnique({
            where: { id: ctx.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                // image: true, // Se tiveres este campo no teu schema.prisma
            },
        });

        return usuarioCompleto;
    }),
    // Futuramente, adicionaremos "criarTarefa" ou "listarTarefas" aqui!
    // --- 2. NOVA FUNÇÃO: CRIAR TAREFA ---
    // Não se esqueça da vírgula antes de começar a nova função!
    criarTarefa: protectedProcedure
        // O Zod valida os dados da tarefa antes de salvar
        .input(
            z.object({
                titulo: z
                    .string()
                    .min(1, "O título da tarefa não pode estar vazio"),
                descricao: z.string().optional(), // opcional, pois a pessoa pode querer só um título
            }),
        )
        // mutation = vamos alterar/inserir algo no banco de dados
        .mutation(async ({ input, ctx }) => {
            // Chamamos o Prisma para criar a tarefa na tabela 'Tarefas'
            const novaTarefa = await prisma.tarefas.create({
                data: {
                    titulo: input.titulo,
                    descricao: input.descricao,
                    // O Prisma é inteligente: ao passarmos o userId, ele já cria o vínculo (relation)
                    // com o Usuário correto automaticamente!
                    userId: ctx.user.id,
                },
            });

            // Retornamos a tarefa recém-criada para o frontend
            return {
                mensagem: "Tarefa adicionada com sucesso!",
                tarefa: novaTarefa,
            };
        }),

    // --- NOVA FUNÇÃO: LISTAR TAREFAS ---
    listarTarefas: publicProcedure
        .input(
            z.object({
                userId: z.number(), // Precisamos saber de qual usuário queremos as tarefas
            }),
        )
        // Usamos 'query' porque estamos apenas LENDO dados, não alterando
        .query(async ({ input }) => {
            // Pedimos ao Prisma para buscar várias tarefas (findMany)
            const tarefas = await prisma.tarefas.findMany({
                where: {
                    userId: input.userId, // Onde o dono da tarefa seja o nosso usuário
                },
                orderBy: {
                    id: "desc", // Ordena da mais nova para a mais velha (descendente)
                },
            });

            return tarefas;
        }),
    login: publicProcedure
        .input(
            z.object({
                email: z.email("Digite um email válido"),
                password: z
                    .string()
                    .min(3, "A senha deve ter no mínimo 3 caracteres"),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            // 1. Verificamos se o usuário existe
            const usuarioExistente = await prisma.user.findUnique({
                where: { email: input.email },
            });

            if (!usuarioExistente) {
                // No tRPC, lançamos erros assim:
                throw new Error("Este email não foi cadastrado.");
            }

            // 2. Compara a senha do usuário com a senha digitada pelo usuário
            const senhaCorreta = await bcrypt.compare(
                input.password,
                usuarioExistente.password,
            );

            if (!senhaCorreta) {
                // No tRPC, lançamos erros assim:
                throw new Error("A senha está incorreta.");
            }
            const token = jwt.sign(
                { userId: usuarioExistente.id },
                process.env.JWT_SECRET!,
                { expiresIn: "1h" },
            );

            (await cookies()).set("auth-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });

            return { success: true, name: usuarioExistente.name };
        }),
    logout: publicProcedure.mutation(async () => {
        const cookieStore = await cookies();
        // Apagar o cookie é simples: basta dar um .delete() ou setar com maxAge: 0
        cookieStore.delete("auth-token");

        return { success: true };
    }),
    // 3. Retornamos o sucesso
});

// Exportamos o TIPO do roteador. É isso que dá o "superpoder" ao Frontend saber o que existe no Backend!
export type AppRouter = typeof appRouter;
