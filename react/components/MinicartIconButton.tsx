import React, { useMemo, FC } from 'react'
import { ButtonWithIcon } from 'vtex.styleguide'
import { IconCart } from 'vtex.store-icons'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCssHandles } from 'vtex.css-handles'

import { useMinicartDispatch, useMinicartState } from '../MinicartContext'
import styles from '../styles.css'

const CSS_HANDLES = ['minicartIconContainer', 'minicartQuantityBadge'] as const

interface MinicartIconButtonProps {
  quantityDisplay: MinicartIconButtonType
}

const MinicartIconButton: FC<MinicartIconButtonProps> = ({
  quantityDisplay,
}) => {
  const { orderForm, loading }: OrderFormContext = useOrderForm()
  const handles = useCssHandles(CSS_HANDLES)
  const { open, openBehavior, openOnHoverProp } = useMinicartState()
  const dispatch = useMinicartDispatch()
  const itemQuantity = loading ? 0 : orderForm.items.length

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

  const DISPLAY_TYPES = {
    always: 'always',
    notEmpty: 'not-empty',
    never: 'never',
  }

  const showQuantityBadge = useMemo(
    () =>
      (itemQuantity > 0 && quantityDisplay === DISPLAY_TYPES.notEmpty) ||
      quantityDisplay === DISPLAY_TYPES.always,
    [quantityDisplay, itemQuantity]
  )

  return (
    <ButtonWithIcon
      icon={
        <span className={`${handles.minicartIconContainer} gray relative`}>
          <IconCart />
          {showQuantityBadge && (
            <span
              style={{ userSelect: 'none' }}
              className={`${handles.minicartQuantityBadge} ${styles.minicartQuantityBadgeDefault} c-on-emphasis absolute t-mini bg-emphasis br4 w1 h1 pa1 flex justify-center items-center lh-solid`}
            >
              {itemQuantity}
            </span>
          )}
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
