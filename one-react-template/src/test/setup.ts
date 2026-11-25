import "reflect-metadata";

// Test entry polyfill: tsyringe needs reflect metadata before any module
// resolves services from the DI container. Mirrors src/main.tsx.
