"use client"; // Obrigatório porque o SessionProvider usa React Context

import { SessionProvider } from "next-auth/react";
import React from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}