interface MinicartProps {
  variation: minicartVariation
  openOnHover: boolean
  linkVariationUrl: string
  maxDrawerWidth: number | string
  drawerSlideDirection: slideDirection
}

type slideDirection = 'horizontal' | 'vertical' | 'rightToLeft' | 'leftToRight'
type minicartVariation = 'popup' | 'drawer' | 'link'
