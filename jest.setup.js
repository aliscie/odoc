// jest.setup.js
console.log("//------------------------------------------- running jest.setup.js -------------------------------------------\\")

// Import TextEncoder using ESM syntax
import { TextEncoder } from 'util';

// Import fetch using ESM syntax
import fetch from 'node-fetch';

global.TextEncoder = TextEncoder;
global.fetch = fetch;

console.log('Running jest.setup.js');
