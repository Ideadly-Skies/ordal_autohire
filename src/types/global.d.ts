// src/types/global.d.ts
export {};

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        handlers?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (error: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}
