import React from 'react';
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useMinicartCssHandles } from './CssHandlesContext'
import styles from '../styles.css'

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

interface Props {
  itemCountMode: MinicartTotalItemsType
  quantityDisplay: QuantityDisplayType
}


const QuantityBadge: React.FC<Props> = props => { 
  const { itemCountMode, quantityDisplay = 'not-empty' } = props
  const { orderForm, loading }: OrderFormContext = useOrderForm()
  const quantity = countCartItems(itemCountMode, orderForm.items)
  const { handles } = useMinicartCssHandles()
  const itemQuantity = loading ? 0 : quantity

  const showQuantityBadge =
  (itemQuantity > 0 && quantityDisplay === 'not-empty') ||
  quantityDisplay === 'always'

  return (
    <>
      {showQuantityBadge && (
        <span
          style={{ userSelect: 'none' }}
          className={`${handles.minicartQuantityBadge} ${styles.minicartQuantityBadgeDefault} c-on-emphasis absolute t-mini bg-emphasis br4 w1 h1 pa1 flex justify-center items-center lh-solid`}
        >
          {itemQuantity}
        </span>
      )}
    </>
  );
}

export default QuantityBadge;