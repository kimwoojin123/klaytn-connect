/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADRESS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}