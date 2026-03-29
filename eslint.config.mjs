import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    globalIgnores([
        ".next/**",
        "out/**",
        "build/**",
        "node_modules/**",
        "next-env.d.ts",
    ]),
    {
        rules: {
            // 1. Variáveis não usadas: Dá apenas um aviso amarelo em vez de quebrar o site (erro vermelho)
            "@typescript-eslint/no-unused-vars": "warn",

            // 2. Permite usar o tipo 'any' temporariamente (útil enquanto estás a construir e a testar)
            "@typescript-eslint/no-explicit-any": "warn",

            // 3. Permite que uses console.log() à vontade para debugar
            "no-console": "off",

            // 4. Exige que uses === em vez de == (evita muitos bugs lógicos no JavaScript)
            eqeqeq: ["error", "always"],
        },
    },
]);

export default eslintConfig;
