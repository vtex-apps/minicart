import React, { FC } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { useMinicartDispatch } from './MinicartContext'

const CSS_HANDLES = [
  'closeIconContainer',
  'closeIconButton',
  'closeButtonText',
] as const

interface CloseButtonProps {
  Icon: React.ComponentType
  text: string
}

const CloseButton: FC<CloseButtonProps> = props => {
  const { Icon, text } = props
  const dispatch = useMinicartDispatch()

  const { handles } = useCssHandles(CSS_HANDLES)

  const handleClick = () => {
    dispatch({ type: 'CLOSE_MINICART' })
  }
  return (
    <div className={`${handles.closeIconContainer} `}>
      <button
        className={`${handles.closeIconButton} bg-transparent pointer bg-transparent transparent bn pointer`}
        onClick={handleClick}
      >
        {Icon && <Icon />}
        {text && <p className={`${handles.closeButtonText} `}>{text}</p>}
      </button>
    </div>
  )
}

export default CloseButton
