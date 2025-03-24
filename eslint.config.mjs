import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from "globals";
import stylisticTs from '@stylistic/eslint-plugin-ts';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        plugins: {
            '@stylistic/ts': stylisticTs
        },
        rules: {
            '@stylistic/ts/indent': ['error', 4],
            '@stylistic/ts/semi': ['error', "always"],
        },
        languageOptions: {
            globals: {
                ...globals.node
            },
        }
    },
);