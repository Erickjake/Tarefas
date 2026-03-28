// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    // 1. Tenta pegar o token do cookie
    const token = request.cookies.get("auth-token")?.value;

    // 2. Se o utilizador tenta aceder à dashboard sem token, manda para o login
    if (!token && request.nextUrl.pathname.startsWith("/tarefa")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 3. Se já está logado e tenta ir para o login, manda para a dashboard
    if (token && request.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/tarefa", request.url));
    }

    return NextResponse.next();
}

// Define quais rotas o proxy deve vigiar
export const config = {
    matcher: ["/:path*", "/login"],
};
