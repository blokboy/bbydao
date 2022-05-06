import React      from "react"
import { HiX }    from "react-icons/hi"
import { Portal } from "react-portal"

const Modal = ({close, children, heading}) => {
  return (
    <Portal node={document && document.getElementById('modal')}>
      <div className="absolute top-16 h-screen w-screen" onClick={() => close()}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="flex w-full justify-end">
            <div className="w-full text-center text-xl font-medium">{heading}</div>
            <button
              className="modal-close-btn"
              onClick={() => close()}
            >
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
