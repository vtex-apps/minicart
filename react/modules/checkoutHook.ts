import { useCheckoutURL } from 'vtex.checkout-resources/Utils'
import { useRuntime } from 'vtex.render-runtime'

export default function useCheckout() {
  const { url: checkoutUrl, major } = useCheckoutURL()
  const { navigate, rootPath = '' } = useRuntime()

  const goToCheckout = (url: string) => {
    if (major > 0 && url === checkoutUrl) {
      navigate({ to: url })
    } else {
      window.location.href = `${rootPath}${url}`
    }
  }

  return goToCheckout
}
