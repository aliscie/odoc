module.exports = {
    root: true,
    env: {browser: true, es2020: true},
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended', 'plugin:storybook/recommended'],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],
    rules: {
        "react/react-in-jsx-scope": "off",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": "warn",
        '@typescript-eslint/no-unused-vars': ['warn', {'varsIgnorePattern': '^_', 'argsIgnorePattern': '^_'}],
        'react-refresh/only-export-components': [
            'warn',
            {allowConstantExport: true},
        ],
    },
}