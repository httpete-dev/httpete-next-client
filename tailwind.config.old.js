"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultTheme_1 = require("tailwindcss/defaultTheme");
exports.default = {
    content: ["./src/**/*.tsx"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-geist-sans)", ...defaultTheme_1.fontFamily.sans],
            },
        },
    },
    plugins: [],
};
