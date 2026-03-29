// Local do arquivo: prettier.config.js

module.exports = {
    semi: true, // Usa sempre ponto e vírgula no final
    singleQuote: false, // Usa aspas duplas ("") em vez de simples ('')
    tabWidth: 4, // 4 espaços de indentação (combina com o teu .editorconfig!)
    trailingComma: "es5", // Coloca vírgula no final de objetos/arrays (ajuda muito no Git)
    printWidth: 100, // Só quebra a linha se ela passar de 100 caracteres
    plugins: ["prettier-plugin-tailwindcss"], // Organiza o Tailwind como magia!
};
