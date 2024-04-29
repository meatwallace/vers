/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;

  readonly VITE_AUTH0_AUDIENCE: string;
  readonly VITE_AUTH0_CALLBACK_URL: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_LOGOUT_URL: string;
  readonly VITE_AUTH0_RETURN_URL: string;

  readonly VITE_ENABLE_MSW: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
