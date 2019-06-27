import { Alert } from 'vtex.styleguide'
import { createPortal } from 'react-dom'
import React, { Fragment } from 'react'

const AlertMessage = ({ message, type = "warning", onClose }) => {
  const canUsePortal = () => document && document.body

  return (
    <Fragment>
      {message && canUsePortal() &&
        createPortal(
          <div className="fixed bottom-1 right-1 z-max">
            <Alert type={type} onClose={onClose} autoClose={5000}>
              {message}
            </Alert>
          </div>,
          document.body
        )
      }
    </Fragment>
  )
}

export default AlertMessage