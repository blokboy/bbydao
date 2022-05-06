import React from "react"
import { HiX } from "react-icons/hi"
import { Portal } from "react-portal"

const Modal = ({ close, children, heading }) => {
  const ref = React.useRef(null)
  React.useEffect(() => {
    ref?.current?.focus()
  }, [ref])
  const handleKeyDown = event => {
    if (event.keyCode === 27) {
      close()
    }
  }

  return (
    <Portal node={document && document.getElementById("modal")}>
      <div className="absolute top-0 h-screen w-screen" onClick={() => close()}>
        <div
          className="modal-container"
          onClick={e => e.stopPropagation()}
          role="document"
          aria-modal={true}
          tabIndex={0}
          onKeyDown={e => handleKeyDown(e)}
          ref={ref}
        >
          <div className="flex w-full justify-end py-4">
            <div className="w-full text-center text-xl font-medium">{heading}</div>
            <button className="modal-close-btn" onClick={() => close()}>
              <HiX />
            </button>
          </div>
          {children}
        </div>
      </div>
    </Portal>
  )
}

export default Modal
