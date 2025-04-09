import React, { useEffect, useState } from 'react'
import { ButtonWithIcon } from 'vtex.styleguide'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCheckoutURL } from 'vtex.checkout-resources/Utils'

import styles from '../styles.css'
import { useMinicartCssHandles } from './CssHandlesContext'
import { useMinicartDispatch, useMinicartState } from '../MinicartContext'
import useCheckout from '../modules/checkoutHook'
import { fetchWithRetry } from '../legacy/utils/fetchWithRetry'

export const CSS_HANDLES = [
  'minicartIconContainer',
  'minicartQuantityBadge',
] as const

interface Props {
  Icon: React.ComponentType
  quantityDisplay: QuantityDisplayType
  itemCountMode: MinicartTotalItemsType
  variation?: string
}

const countCartItems = (
  countMode: MinicartTotalItemsType,
  allItems: OrderFormItem[],
  packagesSkuIds: string[],
  sgrSkuIds: string[]
) => {
  // Filter only main products, remove assembly items from the count
  const items = allItems.filter(
    item =>
      item.parentItemIndex === null &&
      item.productId &&
      !packagesSkuIds.includes(item.productId) &&
      !sgrSkuIds.includes(item.productId)
  )

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
  const { Icon, itemCountMode, quantityDisplay, variation } = props
  const { orderForm, loading }: OrderFormContext = useOrderForm()
  const { handles } = useMinicartCssHandles()
  const { open, openBehavior, openOnHoverProp } = useMinicartState()
  const dispatch = useMinicartDispatch()
  const [packagesSkuIds, setPackagesSkuIds] = useState<string[]>([])
  const [sgrSkuIds, setSgrSkuIds] = useState<string[]>([])

  useEffect(() => {
    let isSubscribed = true

    fetchWithRetry('/_v/private/api/cart-bags-manager/app-settings', 3).then(
      (res: PackagesSkuIds) => {
        if (res && isSubscribed) {
          try {
            const { bagsSettings, sgrSettings } = res?.data ?? {}

            setPackagesSkuIds(Object.values(bagsSettings))

            const allSkuIds: string[] = []

            Object.values(sgrSettings).forEach(sgrType => {
              if (sgrType?.skuIds) {
                allSkuIds.push(...sgrType.skuIds)
              }
            })

            setSgrSkuIds(allSkuIds)
          } catch (error) {
            console.error('Error in packages feature.', error)
          }
        }
      }
    )

    return () => {
      isSubscribed = false
    }
  }, [])
  const quantity = countCartItems(
    itemCountMode,
    orderForm.items,
    packagesSkuIds,
    sgrSkuIds
  )
  const itemQuantity = loading ? 0 : quantity
  const { url: checkoutUrl } = useCheckoutURL()
  const goToCheckout = useCheckout()

  const handleClick = () => {
    if (openOnHoverProp) {
      if (variation === 'popupWithLink') {
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
