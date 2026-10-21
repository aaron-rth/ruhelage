/// <reference types="vite/client" />

declare module '*.md?raw' {
  const inhalt: string;
  export default inhalt;
}
