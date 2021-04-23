import React from 'react'
import { ButtonWithIcon } from 'vtex.styleguide'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import styles from '../styles.css'
import { useMinicartCssHandles } from './CssHandlesContext'
import { useMinicartDispatch, useMinicartState } from '../MinicartContext'
import { useCheckoutURL } from 'vtex.checkout-resources/Utils'
import useCheckout from '../modules/checkoutHook'

export const CSS_HANDLES = [
  'minicartIconContainer',
  'minicartQuantityBadge',
] as const

interface Props {
  Icon: React.ComponentType
  quantityDisplay: QuantityDisplayType
  itemCountMode: MinicartTotalItemsType
  popupWithLink?: boolean
}

const countCartItems = (
  countMode: MinicartTotalItemsType,
  allItems: OrderFormItem[]
) => {
  // Filter only main products, remove assembly items from the count
  const items = allItems.filter(item => item.parentItemIndex === null)

  if (countMode === 'distinctAvailable') {
    return items.reduce((itemQuantity: number, item) => {
      if (item.availability === 'available') {
        return itemQuantity + 1
      }
      return itemQuantity
    }, 0)
  }

  if (countMode === 'totalAvailable') {
    return items.reduce((itemQuantity: number, item) => {
      if (item.availability === 'available') {
        return itemQuantity + item.quantity
      }
      return itemQuantity
    }, 0)
  }

  if (countMode === 'total') {
    return items.reduce((itemQuantity: number, item) => {
      return itemQuantity + item.quantity
    }, 0)
  }

  // countMode === 'distinct'
  return items.length
}

const MinicartIconButton: React.FC<Props> = props => {
  const { Icon, itemCountMode, quantityDisplay, popupWithLink } = props
  const { orderForm, loading }: OrderFormContext = useOrderForm()
  const { handles } = useMinicartCssHandles()
  const { open, openBehavior, openOnHoverProp } = useMinicartState()
  const dispatch = useMinicartDispatch()
  const quantity = countCartItems(itemCountMode, orderForm.items)
  const itemQuantity = loading ? 0 : quantity
  const { url: checkoutUrl } = useCheckoutURL()
  const goToCheckout = useCheckout()  
  const handleClick = () => {
    if (openOnHoverProp) {
      if(popupWithLink){
        goToCheckout(checkoutUrl)
      }
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

  const showQuantityBadge =
    (itemQuantity > 0 && quantityDisplay === 'not-empty') ||
    quantityDisplay === 'always'

  return (
    <ButtonWithIcon
      icon={
        <span className={`${handles.minicartIconContainer} gray relative`}>
          <Icon />
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
