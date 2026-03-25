// Local do arquivo: app/Provider.tsx

"use client"; // Isso avisa ao Next.js que este código roda no navegador do usuário

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from '../lib/trpc'; // O tradutor que acabamos de criar

export default function Provider({ children }: { children: React.ReactNode }) {
    // Criamos o gerenciador de dados do React Query
    const [queryClient] = useState(() => new QueryClient());

    // Criamos a conexão do tRPC apontando para a nossa rota de API
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: '/api/trpc', // A pasta que criamos na aula passada!
                }),
            ],
        })
    );

    // Abraçamos o nosso site com os provedores para que a comunicação funcione
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    );
}