import React from 'react'
import { ButtonWithIcon } from 'vtex.styleguide'
import { IconCart } from 'vtex.store-icons'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCssHandles } from 'vtex.css-handles'

import { useMinicartDispatch, useMinicartState } from '../MinicartContext'
import styles from '../styles.css'

const CSS_HANDLES = ['minicartIconContainer', 'minicartQuantityBadge'] as const

const MinicartIconButton = () => {
  const { orderForm, loading }: OrderFormContext = useOrderForm()
  const handles = useCssHandles(CSS_HANDLES)
  const { open, openOnHoverBehavior, openOnHoverProp } = useMinicartState()
  const dispatch = useMinicartDispatch()

  const itemQuantity = loading ? 0 : orderForm.items.length

  return (
    <ButtonWithIcon
      icon={
        <span
          onMouseEnter={
            openOnHoverBehavior
              ? () => dispatch({ type: 'OPEN_MINICART' })
              : undefined
          }
          className={`${handles.minicartIconContainer} gray relative`}
        >
          <IconCart />
          {itemQuantity > 0 && (
            <span
              className={`${handles.minicartQuantityBadge} ${styles.minicartQuantityBadgeDefault} c-on-emphasis absolute t-mini bg-emphasis br4 w1 h1 pa1 flex justify-center items-center lh-solid`}
            >
              {itemQuantity}
            </span>
          )}
        </span>
      }
      variation="tertiary"
      onClick={() => {
        if (!openOnHoverProp) {
          dispatch({ type: open ? 'CLOSE_MINICART' : 'OPEN_MINICART' })
          return
        }
        if (openOnHoverBehavior) {
          dispatch({
            type: 'SET_OPEN_ON_HOVER_BEHAVIOR',
            value: false,
          })
          return
        }
        if (open) {
          dispatch({ type: 'CLOSE_MINICART' })
          dispatch({
            type: 'SET_OPEN_ON_HOVER_BEHAVIOR',
            value: true,
          })
          return
        }
        dispatch({ type: 'OPEN_MINICART' })
      }}
    />
  )
}

export default MinicartIconButton
