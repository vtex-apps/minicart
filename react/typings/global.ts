type QuantityDisplayType = 'always' | 'never' | 'not-empty'

type MinicartTotalItemsType =
  | 'total'
  | 'distinct'
  | 'totalAvailable'
  | 'distinctAvailable'
  | 'totalWithoutAssemblies'
  | 'distinctWithoutAssemblies'
  | 'totalWithoutAssembliesAvailable'
  | 'distinctWithoutAssembliesAvailable'

type SlideDirectionType =
  | 'horizontal'
  | 'vertical'
  | 'rightToLeft'
  | 'leftToRight'

type MinicartVariationType = 'popup' | 'drawer' | 'link'
