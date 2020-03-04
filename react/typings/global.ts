interface MinicartProps {
  variation: MinicartVariationType
  openOnHover: boolean
  linkVariationUrl: string
  maxDrawerWidth: number | string
  drawerSlideDirection: SlideDirectionType
  alwaysShowQuantityBadge: boolean
}

interface MinicartIconButtonProps {
  alwaysShowQuantityBadge: boolean
}

type SlideDirectionType =
  | 'horizontal'
  | 'vertical'
  | 'rightToLeft'
  | 'leftToRight'
type MinicartVariationType = 'popup' | 'drawer' | 'link'

