import React from "react"
import { HiX } from "react-icons/hi"
import { PortalWithState } from "react-portal"

const Modal = ({ onClose = () => {}, children, trigger, triggerText, heading }) => {
  const node = document ? document.querySelector("body") : null

  const handleClose = React.useCallback(
    callbackFunc => {
      onClose()
      callbackFunc()
    },
    [onClose]
  )

  if (!node) {
    return null
  }

  return (
    <PortalWithState node={node} closeOnEsc>
      {({ openPortal, closePortal, portal }) => (
        <>
          {trigger ? (
            React.cloneElement(trigger, {
              onClick: openPortal,
            })
          ) : (
            <button type="button" onClick={openPortal}>
              {triggerText}
            </button>
          )}
          {portal(
            <div
              id="modal-background"
              className="fixed inset-0 z-50 backdrop-blur overflow-y-scroll"
              onClick={e => (e.target?.id === "modal-background" ? closePortal() : () => {})}
            >
              <div className="modal-container fade-in-up" role="dialog" aria-modal={true}>
                <div className="flex w-full justify-end py-4">
                  <div className="w-full text-center text-xl font-medium">{heading}</div>
                  <button className="modal-close-btn" onClick={() => handleClose(closePortal)}>
                    <HiX />
                  </button>
                </div>
                {children}
              </div>
            </div>
          )}
        </>
      )}
    </PortalWithState>
  )
}

export default Modal
