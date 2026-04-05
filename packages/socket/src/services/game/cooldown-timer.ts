import { EVENTS } from "@rahoot/common/constants"
import type { Server } from "@rahoot/common/types/game/socket"

export class CooldownTimer {
  private readonly io: Server
  private readonly gameId: string
  private active = false

  constructor(io: Server, gameId: string) {
    this.io = io
    this.gameId = gameId
  }

  start(seconds: number): Promise<void> {
    if (this.active) {
      return Promise.resolve()
    }

    this.active = true
    let count = seconds - 1

    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!this.active || count <= 0) {
          this.active = false
          clearInterval(interval)
          resolve()

          return
        }

        this.io.to(this.gameId).emit(EVENTS.GAME.COOLDOWN, count)
        count -= 1
      }, 1000)
    })
  }

  abort() {
    this.active &&= false
  }
}
