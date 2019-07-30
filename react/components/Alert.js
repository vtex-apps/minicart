import { Alert } from 'vtex.styleguide'
import { createPortal } from 'react-dom'
import React from 'react'

const Alert = ({ children, type = "warning", onClose, action }) => {
  const canUsePortal = () => document && document.body
  return (
    <>
      {children && canUsePortal() &&
        createPortal(
          <div className="fixed bottom-1 right-1 z-max">
            <Alert type={type} onClose={onClose} action={action} autoClose={5000}>
              {children}
            </Alert>
          </div>,
          document.body
        )
      }
    </>
  )
}

 export default Alert