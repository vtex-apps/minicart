import { useRef } from 'react'
import { usePixel } from 'vtex.pixel-manager'
import debounce from 'debounce'

export default function useDebouncedPush() {
  const { push } = usePixel()
  const debouncedPush = useRef<typeof push>(debounce(push, 600))

  return debouncedPush.current
}
