import React from 'react'
import { ButtonWithIcon } from 'vtex.styleguide'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import styles from '../styles.css'
import { useMinicartCssHandles } from './CssHandlesContext'
import { useMinicartDispatch, useMinicartState } from '../MinicartContext'

export const CSS_HANDLES = [
  'minicartIconContainer',
  'minicartQuantityBadge',
] as const

interface Props {
  Icon: React.ComponentType
  quantityDisplay: QuantityDisplayType
  itemCountMode: MinicartTotalItemsType
}

const groupByUniqueId = <T extends { uniqueId: string }>(
  items: T[][],
  item: T
): T[][] => {
  const index = items.findIndex(([{ uniqueId }]) => uniqueId === item.uniqueId)

  if (index !== -1) {
    items.splice(index, 1, items[index].concat([item]))

    return items
  }

  return items.concat([[item]])
}

const countCartItems = (
  countMode: MinicartTotalItemsType,
  items: OrderFormItem[]
) => {
  if (countMode === 'distinctAvailable') {
    return items
      .filter((item) => item.availability === 'available')
      .reduce<OrderFormItem[][]>(groupByUniqueId, []).length
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
  return items.reduce<OrderFormItem[][]>(groupByUniqueId, []).length
}

const MinicartIconButton: React.FC<Props> = (props) => {
  const { Icon, itemCountMode, quantityDisplay } = props
  const { orderForm, loading }: OrderFormContext = useOrderForm()
  const { handles } = useMinicartCssHandles()
  const { open, openBehavior, openOnHoverProp } = useMinicartState()
  const dispatch = useMinicartDispatch()
  const quantity = countCartItems(itemCountMode, orderForm.items)
  const itemQuantity = loading ? 0 : quantity

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
