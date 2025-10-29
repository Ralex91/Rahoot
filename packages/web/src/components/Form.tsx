import { PropsWithChildren } from "react"

const Form = ({ children }: PropsWithChildren) => (
  <div className="z-10 flex w-full max-w-80 flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
    {children}
  </div>
)

export default Form
