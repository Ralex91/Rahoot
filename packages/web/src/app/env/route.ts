import env from "@rahoot/web/env"
import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json({
    webUrl: env.WEB_ORIGIN,
    socketUrl: env.SOCKET_URL,
  })
}

export const dynamic = "force-dynamic"
