// Local do arquivo: types/next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";

// Estamos a "abrir" o módulo do next-auth para adicionar coisas novas
declare module "next-auth" {
    // Reescrevemos a interface Session
    interface Session {
        // Dizemos que o user tem um 'id' do tipo string
        user: {
            id: string;
        } & DefaultSession["user"]; // E mantemos o name, email e image originais
    }
}

export {};
