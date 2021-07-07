import React from 'react'
import { ButtonWithIcon } from 'vtex.styleguide'

import { useMinicartCssHandles } from './CssHandlesContext'
import { useMinicartDispatch, useMinicartState } from '../MinicartContext'
import QuantityBadge from './QuantityBadge'

export const CSS_HANDLES = [
  'minicartIconContainer',
  'minicartQuantityBadge',
] as const

interface Props {
  Icon: React.ComponentType
  quantityDisplay: QuantityDisplayType
  itemCountMode: MinicartTotalItemsType
}

const MinicartIconButton: React.FC<Props> = props => {
  const { Icon, itemCountMode, quantityDisplay } = props
  const { handles } = useMinicartCssHandles()
  const { open, openBehavior, openOnHoverProp } = useMinicartState()
  const dispatch = useMinicartDispatch()

  const handleClick = () => {
    if (openOnHoverProp) {
      if (openBehavior === 'hover') {
        dispatch({
          type: 'SET_OPEN_BEHAVIOR',
          value: 'click',
        })

        return
      }

      dispatch({ type: 'CLOSE_MINICART' })
      dispatch({
        type: 'SET_OPEN_BEHAVIOR',
        value: 'hover',
      })

      return
    }

    dispatch({ type: open ? 'CLOSE_MINICART' : 'OPEN_MINICART' })
  }

  

  return (
    <ButtonWithIcon
      icon={
        <span className={`${handles.minicartIconContainer} gray relative`}>
          <Icon />
          <QuantityBadge itemCountMode={itemCountMode} quantityDisplay={quantityDisplay}/>
        </span>
      }
      variation="tertiary"
      onMouseEnter={
        openBehavior === 'hover'
          ? () => dispatch({ type: 'OPEN_MINICART' })
          : undefined
      }
      onClick={handleClick}
    />
  )
}

export default MinicartIconButton
