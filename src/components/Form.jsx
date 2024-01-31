export default function Form({ children }) {
  return (
    <div className="bg-white rounded-md shadow-sm p-4 z-10 flex-col flex gap-4 w-full max-w-80">
      {children}
    </div>
  )
}
