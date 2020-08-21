import { useRef } from 'react'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import debounce from 'debounce'

type DebounceFunction = (param: Record<string, unknown>) => void

export default function useDebouncedPush() {
  const { push } = usePixel()
  const debouncedPush = useRef<DebounceFunction>(debounce(push, 600))

  return debouncedPush.current
}
