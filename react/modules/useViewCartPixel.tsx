import { useCallback, useEffect } from 'react'
import { usePixel } from 'vtex.pixel-manager'

import { PixelCartItem, transformOrderFormItems } from './pixelHelper'
import { debounce } from 'debounce'

const useViewCartPixel = (
  isOpen: boolean,
  orderFormItems: OrderForm['items']
) => {
  const { push } = usePixel()

  const transformedItems = transformOrderFormItems(orderFormItems)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    pushViewCart(transformedItems)
  }, [isOpen, transformedItems])

  const pushViewCart = useCallback(
    debounce((items: PixelCartItem[]) => {
      push({
        event: 'viewCart',
        items: items,
      })
    }, 1000),
    [push]
  );
}

export default useViewCartPixel
