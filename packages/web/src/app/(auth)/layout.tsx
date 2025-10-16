"use client"

import { useSocket } from "@rahoot/web/contexts/socketProvider"
import { PropsWithChildren, useEffect } from "react"

const AuthLayout = ({ children }: PropsWithChildren) => {
  const { isConnected, connect } = useSocket()
  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [connect, isConnected])

  return children
}

export default AuthLayout
