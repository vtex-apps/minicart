import { Alert } from 'vtex.styleguide'
import { createPortal } from 'react-dom'
import React, { Fragment } from 'react'


const AlertMessage = ({ message, type = "warning", onClose }) => {
  const canUsePortal = () => document && document.body
  
  return(
    <Fragment>
      { message && canUsePortal() &&
        createPortal(
          <Alert type={type} onClose={ onClose }>
            { message }
          </Alert>,
          document.body
        )
      }
    </Fragment>
  )
}

export default AlertMessage