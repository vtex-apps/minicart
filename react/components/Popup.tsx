/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC } from 'react'
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
  const {
    open,
    hasBeenOpened,
    openOnHoverBehavior,
    openOnHoverProp,
  } = useMinicartState()
  const dispatch = useMinicartDispatch()
  const handles = useCssHandles(CSS_HANDLES)

  const clickHandler = () => {
    if (openOnHoverProp) {
      dispatch({ type: 'SET_OPEN_ON_HOVER_BEHAVIOR', value: true })
    }
    dispatch({ type: 'CLOSE_MINICART' })
  }
  const mouseLeaveHandler = () => {
    if (!openOnHoverBehavior) {
      return
    }
    dispatch({ type: 'CLOSE_MINICART' })
  }

  return (
    <div onMouseLeave={mouseLeaveHandler}>
      <MinicartIconButton />
      {open && (
        <Overlay>
          {!openOnHoverBehavior && (
            <div
              className="fixed top-0 left-0 w-100 h-100"
              onClick={clickHandler}
            />
          )}
          <div
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
                {hasBeenOpened && children}
              </div>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  )
}

export default PopupMode
