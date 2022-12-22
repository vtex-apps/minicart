import { FC } from 'react'

declare global {
  interface StoreFunctionComponent<P = {}> extends FC<P> {
    schema?: object
  }

  type QuantityDisplayType = 'always' | 'never' | 'not-empty'

  type MinicartTotalItemsType =
    | 'total'
    | 'distinct'
    | 'totalAvailable'
    | 'distinctAvailable'

  type SlideDirectionType =
    | 'horizontal'
    | 'vertical'
    | 'rightToLeft'
    | 'leftToRight'

  type MinicartVariationType =
    | 'popup'
    | 'drawer'
    | 'link'
    | 'popupWithLink'
    | 'block'
}
