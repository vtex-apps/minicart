import React, { FC } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCssHandles } from 'vtex.css-handles'

import MinicartIconButton from './components/MinicartIconButton'
import DrawerMode from './components/DrawerMode'

import { MinicartContextProvider, useMinicartState } from './MinicartContext'
import PopupMode from './components/Popup'

const CSS_HANDLES = ['minicartWrapperContainer', 'minicartContainer'] as const

const Minicart: FC<MinicartProps> = ({
  maxDrawerWidth = 400,
  drawerSlideDirection = 'rightToLeft',
  linkVariationUrl = '/checkout/#/cart',
  children,
}) => {
  const { orderForm }: OrderFormContext = useOrderForm()
  const handles = useCssHandles(CSS_HANDLES)
  const { variation } = useMinicartState()

  if (!orderForm) {
    return null
  }

  if (variation === 'link') {
    return (
      <aside
        className={`${handles.minicartWrapperContainer} relative fr flex items-center`}
      >
        <div className={`${handles.minicartContainer} flex flex-column`}>
          <a href={linkVariationUrl}>{MinicartIconButton}</a>
        </div>
      </aside>
    )
  }

  return (
    <aside
      className={`${handles.minicartWrapperContainer} relative fr flex items-center`}
    >
      <div className={`${handles.minicartContainer} flex flex-column`}>
        {variation === 'drawer' ? (
          <DrawerMode
            maxDrawerWidth={maxDrawerWidth}
            drawerSlideDirection={drawerSlideDirection}
          >
            {children}
          </DrawerMode>
        ) : (
          <PopupMode>{children}</PopupMode>
        )}
      </div>
    </aside>
  )
}

const EnhancedMinicart = (props: MinicartProps) => (
  <MinicartContextProvider
    variation={props.variation}
    openOnHover={props.openOnHover}
  >
    <Minicart {...props} />
  </MinicartContextProvider>
)

export default EnhancedMinicart
