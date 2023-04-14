import { useEffect } from 'react'
import { usePixel } from 'vtex.pixel-manager'
import { transformOrderFormItems } from './pixelHelper'

const useViewCartPixel = (isOpen: boolean, orderFormItems: OrderForm['items']) => {
  const { push } = usePixel()

	const transformedItems = transformOrderFormItems(orderFormItems)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    push({
      event: 'viewCart',
      items: transformedItems,
    })
  }, [push, isOpen, orderFormItems])
}

export default useViewCartPixel
