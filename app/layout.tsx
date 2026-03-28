// Local do arquivo: app/layout.tsx

import "./globals.css";
import Provider from "./Provider";
import Header from "@/components/Header"; // (ou o caminho correto onde ele está)

import { Geist, Inter, Raleway } from "next/font/google";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

const ralewayHeading = Raleway({ subsets: ['latin'], variable: '--font-heading' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className={cn("font-sans", inter.variable, ralewayHeading.variable)}>

            {/* TUDO O QUE FOR VISUAL TEM QUE FICAR AQUI DENTRO DO BODY! */}
            <body className="bg-slate-50 min-h-screen">
                <Provider>

                    {/* O Header fica dentro do Provider e dentro do Body */}
                    <Header />

                    {/* O conteúdo da página de tarefas aparece aqui */}
                    <main>
                        {children}
                    </main>
                    <Footer />
                </Provider>
            </body>

        </html>
    );
}