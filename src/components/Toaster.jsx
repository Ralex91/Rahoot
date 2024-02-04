import { Toaster as ToasterRaw, ToastBar } from "react-hot-toast"

const Toaster = () => (
  <ToasterRaw>
    {(t) => (
      <ToastBar
        toast={t}
        style={{
          ...t.style,
          boxShadow: "rgba(0, 0, 0, 0.25) 0px -4px inset",
          fontWeight: 700,
        }}
      >
        {({ icon, message }) => (
          <>
            {icon}
            {message}
          </>
        )}
      </ToastBar>
    )}
  </ToasterRaw>
)

export default Toaster
