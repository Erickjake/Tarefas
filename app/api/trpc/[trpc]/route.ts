// Local do arquivo: app/api/trpc/[trpc]/route.ts

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../../server"; // Importamos nosso roteador

// Esta função pega qualquer requisição HTTP e entrega para o tRPC resolver
const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: () => ({}),
    });

// O tRPC lida tanto com GET (buscar dados) quanto POST (enviar dados)
export { handler as GET, handler as POST };
