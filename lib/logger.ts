export const logger = {
  info: (message: string) => console.info(`@post-card/core: ℹ️ ${message}`),
  success: (message: string) => console.log(`@post-card/core: ✅ ${message}`),
  error: (message: string) => console.error(`@post-card/core: ❌ ${message}`),
}
