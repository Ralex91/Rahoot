import { createEnv } from "@t3-oss/env-core"
import { z } from "zod/v4"

const env = createEnv({
  server: {
    SOCKER_PORT: z.string().optional().default("3001"),
  },

  runtimeEnv: {
    SOCKER_PORT: process.env.SOCKER_PORT,
  },
})

export default env
