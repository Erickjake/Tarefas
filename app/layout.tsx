// Local do arquivo: app/layout.tsx
// (Mantenha os seus imports normais de fonte e CSS que já estiverem aí)

import Provider from "./Provider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className={cn("font-sans", geist.variable)}>
            <body>
                {/* Envolvemos o conteúdo do site com o Provedor */}
                <Provider>
                    {children}
                </Provider>
            </body>
        </html>
    );
}