import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server"; // teu router principal
import { createContext } from "@/server/context";

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        // Apenas chame a função sem argumentos se ela não precisar mais do 'req'
        createContext: () => createContext(),
    });

export { handler as GET, handler as POST };
