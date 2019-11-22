/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC, Fragment } from 'react'
import { Overlay } from 'vtex.react-portal'
import { useCssHandles } from 'vtex.css-handles'

import { useMinicartState, useMinicartDispatch } from '../MinicartContext'
import MinicartIconButton from './MinicartIconButton'
import styles from '../styles.css'

const CSS_HANDLES = [
  'popupWrapper',
  'popupContentContainer',
  'arrowUp',
  'popupChildrenContainer',
]

const PopupMode: FC = ({ children }) => {
  const { isOpen, openOnHover } = useMinicartState()
  const dispatch = useMinicartDispatch()
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <Fragment>
      <MinicartIconButton />
      {isOpen && (
        <Overlay>
          <div
            className="fixed top-0 left-0 w-100 h-100"
            onClick={() => dispatch({ type: 'CLOSE_MINICART' })}
          />
          <div
            onMouseLeave={
              openOnHover
                ? () => dispatch({ type: 'CLOSE_MINICART' })
                : undefined
            }
            className={`${handles.popupWrapper} ${styles.popupBoxPosition} absolute z-max flex flex-colunm`}
          >
            <div
              className={`${handles.popupContentContainer} w-100 shadow-3 bg-base`}
            >
              <div
                className={`${handles.arrowUp} ${styles.popupArrowUp} absolute top-0 bg-base h1 w1 pa4 rotate-45`}
              />
              <div
                className={`${handles.popupChildrenContainer} mt3 bg-base relative flex flex-column ph5 pv3`}
              >
                {children}
              </div>
            </div>
          </div>
        </Overlay>
      )}
    </Fragment>
  )
}

export default PopupMode
