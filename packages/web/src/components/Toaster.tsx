import { ToastBar, Toaster as ToasterRaw } from "react-hot-toast"

const Toaster = () => (
  <ToasterRaw>
    {(t) => (
      <ToastBar
        toast={t}
        style={{
          ...t.style,
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
