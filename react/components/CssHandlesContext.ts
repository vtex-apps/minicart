import { createCssHandlesContext } from 'vtex.css-handles'

import { CSS_HANDLES as MinicartCssHandles } from '../Minicart'

const { CssHandlesProvider, useContextCssHandles } = createCssHandlesContext(
  MinicartCssHandles
)

export {
  CssHandlesProvider as MinicartCssHandlesProvider,
  useContextCssHandles as useMinicartCssHandles,
}
