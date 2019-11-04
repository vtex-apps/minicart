import React, { FC } from 'react'
import { Overlay } from 'vtex.react-portal'
import { useCssHandles } from 'vtex.css-handles'

const boxPositionStyle = {
  right: -40,
  width: 364,
  top: '100%',
}

const CSS_HANDLES = [
  'popupWrapper',
  'popupContentContainer',
  'arrowUp',
  'popupChildrenContainer',
]

interface Props {
  onOutsideClick: () => void
}

const Popup: FC<Props> = ({ children, onOutsideClick }) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <Overlay>
      <div
        className="fixed top-0 left-0 w-100 h-100"
        onClick={onOutsideClick}
      />
      <div
        className={`${handles.popupWrapper} absolute z-max flex flex-colunm`}
        style={boxPositionStyle}
      >
        <div className={`${handles.popupContentContainer} shadow-3 bg-base`}>
          <div
            className={`${handles.arrowUp} absolute top-0 shadow-3 bg-base h1 w1 pa4 rotate-45`}
            style={{ right: 7 }}
          />
          <div
            className={`${handles.popupChildrenContainer} overflow-y-scroll mt3 bg-base relative flex flex-column ph5 pv3`}
            style={{ maxHeight: 470 }}
          >
            {children}
          </div>
        </div>
      </div>
    </Overlay>
  )
}

export default Popup
