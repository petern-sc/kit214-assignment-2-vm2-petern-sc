export type AppConfig = {
  jwtSecret: string;
  managementApiUrl: string;
  port: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET must be set");
  }

  const managementApiUrl = env.MANAGEMENT_API_URL;
  if (!managementApiUrl) {
    throw new Error("MANAGEMENT_API_URL must be set");
  }
  const port = Number(env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return {
    jwtSecret,
    managementApiUrl: managementApiUrl,
    port,
  };
}
