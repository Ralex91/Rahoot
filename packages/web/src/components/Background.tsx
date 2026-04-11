import logo from "@rahoot/web/assets/logo.svg"
import type { PropsWithChildren } from "react"

const Background = ({ children }: PropsWithChildren) => (
  <section className="relative flex min-h-dvh flex-col items-center justify-center">
    <div className="absolute h-full w-full overflow-hidden">
      <div className="bg-primary/15 absolute -top-[15vmin] -left-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full" />
      <div className="bg-primary/15 absolute -right-[15vmin] -bottom-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45" />
    </div>

    <img src={logo} className="mb-10 h-16" alt="logo" />
    {children}
  </section>
)

export default Background
