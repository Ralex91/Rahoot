import { type PropsWithChildren } from "react"

const Form = ({ children }: PropsWithChildren) => (
  <div className="z-10 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-4 rounded-md bg-white p-4 shadow-sm sm:w-full sm:p-5">
    {children}
  </div>
)

export default Form
