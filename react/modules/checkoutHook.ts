import { useRuntime } from 'vtex.render-runtime'

export default function useCheckout() {
  const { navigate } = useRuntime()

  const goToCheckout = (url: string) => {
    navigate({ to: url })
  }

  return goToCheckout
}
