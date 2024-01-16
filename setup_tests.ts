import {vi} from "vitest";
import '@testing-library/jest-dom/vitest'


vi.stubGlobal('matchMedia', () => ({
    addEventListener: () => {
    },
}));
