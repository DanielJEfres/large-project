// Suppress dotenv “tip” spam in CI and local Jest runs (routes call dotenv.config()).
process.env.DOTENV_CONFIG_QUIET = 'true'

process.env.ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ?? 'test-access-token-secret-for-jest-only-32b'
process.env.REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ?? 'test-refresh-token-secret-for-jest-only-32b'
process.env.NODE_ENV = 'test'
