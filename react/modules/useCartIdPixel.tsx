import { useEffect } from 'react'
import { usePixel } from 'vtex.pixel-manager'

const useCartIdPixel = (orderFormId?: string) => {
  const { push } = usePixel()

  useEffect(() => {
    if (!orderFormId) {
      return
    }

    push({
      event: 'cartId',
      cartId: orderFormId,
    })
  }, [push, orderFormId])
}

export default useCartIdPixel
