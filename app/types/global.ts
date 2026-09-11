export {};
declare global {
  export interface Window {
    Chatbot?: {
      toggle: () => void;
      open: () => void;
      close: () => void;
    };
  }
}
