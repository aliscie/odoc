module.exports = {
    "bail": 1,
    "verbose": true,
    testEnvironment: 'jsdom',
    moduleFileExtensions: [...require("jest-config").defaults.moduleFileExtensions, 'mts'],
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
        "^.+\\.svg$": "jest-svg-transformer",
        "^.+\\.(css|less|scss)$": "identity-obj-proxy"
    },
    transformIgnorePatterns: ['./node_modules'],
    "presets": [
        "@babel/preset-env",
        ["@babel/preset-react", {"runtime": "automatic"}]
    ],
    // setupFilesAfterEnv: ['./jest.setup.js'],
    setupFiles: ['./jest.setup.js', "./src/frontend/tests/React/mockEventTarget.js"],
    transform: {
        "\\.[jt]sx?$": "babel-jest",
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
        tsconfig: ['ts-jest', {
            allowJs: true,
            jsx: 'react',
            noEmit: true,
            tsconfig: 'tsconfig.json',
            esModuleInterop: true,
        }],

    },

};


