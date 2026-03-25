// Local do arquivo: lib/trpc.ts

// Importamos a função que cria o cliente para o React
import { createTRPCReact } from "@trpc/react-query";
// Importamos APENAS O TIPO do nosso servidor.
// Isso não importa código pesado, apenas as "regras" do que existe lá!
import type { AppRouter } from "../server"; // O arquivo index.ts da pasta server

// Exportamos a nossa ferramenta mágica.
// A partir de agora, usaremos esse "trpc" nas nossas telas!
export const trpc = createTRPCReact<AppRouter>();
