interface MinicartProps {
  variation: MinicartVariationType
  openOnHover: boolean
  initialOpen: boolean
  linkVariationUrl: string
  maxDrawerWidth: number | string
  drawerSlideDirection: SlideDirectionType
  quantityDisplay: MinicartIconButtonType
}

type MinicartIconButtonType = 'always' | 'never' | 'not-empty'

type SlideDirectionType =
  | 'horizontal'
  | 'vertical'
  | 'rightToLeft'
  | 'leftToRight'

type MinicartVariationType = 'popup' | 'drawer' | 'link'
