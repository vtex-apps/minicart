import { useCallback, useEffect } from 'react'
import { usePixel } from 'vtex.pixel-manager'
import { debounce } from 'debounce'

import { PixelCartItem, transformOrderFormItems } from './pixelHelper'

const useViewCartPixel = (
  isOpen: boolean,
  orderFormItems: OrderForm['items']
) => {
  const { push } = usePixel()

  const transformedItems = transformOrderFormItems(orderFormItems)

  const pushViewCart = useCallback(
    debounce((items: PixelCartItem[]) => {
      push({
        event: 'viewCart',
        items,
      })
    }, 1000),
    [push]
  )

  useEffect(() => {
    if (!isOpen) {
      return
    }

    pushViewCart(transformedItems)
  }, [pushViewCart, isOpen, transformedItems])
}

export default useViewCartPixel
