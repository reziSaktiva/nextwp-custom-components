export const debug = {
  warn: (message: string) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[NextWP] ${message}`);
    }
  },
  error: (message: string) => {
    if (process.env.NODE_ENV === "development") {
      console.error(`[NextWP] ${message}`);
    }
  },
  log: (message: string) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[NextWP] ${message}`);
    }
  },
};
