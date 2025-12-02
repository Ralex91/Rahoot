import { createEnv } from "@t3-oss/env-core"
import { z } from "zod/v4"

const env = createEnv({
  server: {
    WEB_ORIGIN: z.string().optional().default("http://localhost:3000"),
    SOCKER_PORT: z.string().optional().default("3001"),
    MANAGER_PASSWORD: z.string(),
    MUSIC_ENABLED: z.enum(["true", "false"]).transform((v) => v === "true"),
  },

  runtimeEnv: {
    WEB_ORIGIN: process.env.WEB_ORIGIN,
    SOCKER_PORT: process.env.SOCKER_PORT,
    MANAGER_PASSWORD: process.env.MANAGER_PASSWORD,
    MUSIC_ENABLED: process.env.MUSIC_ENABLED,
  },
})

export default env
