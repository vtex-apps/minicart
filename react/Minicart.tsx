import React, { FC } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useCheckoutURL } from 'vtex.checkout-resources/Utils'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import MinicartIconButton from './components/MinicartIconButton'
import DrawerMode from './components/DrawerMode'
import { MinicartContextProvider, useMinicartState } from './MinicartContext'
import PopupMode from './components/Popup'
import useCartIdPixel from './modules/useCartIdPixel'

const CSS_HANDLES = ['minicartWrapperContainer', 'minicartContainer'] as const

const Minicart: FC<MinicartProps> = ({
  maxDrawerWidth = 400,
  drawerSlideDirection = 'rightToLeft',
  linkVariationUrl,
  children,
  quantityDisplay,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { variation } = useMinicartState()
  const { url: checkoutUrl } = useCheckoutURL()

  if (variation === 'link') {
    return (
      <aside
        className={`${handles.minicartWrapperContainer} relative fr flex items-center`}
      >
        <div className={`${handles.minicartContainer} flex flex-column`}>
          <a href={linkVariationUrl || checkoutUrl}>
            <MinicartIconButton quantityDisplay={quantityDisplay} />
          </a>
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
            quantityDisplay={quantityDisplay}
          >
            {children}
          </DrawerMode>
        ) : (
          <PopupMode quantityDisplay={quantityDisplay}>{children}</PopupMode>
        )}
      </div>
    </aside>
  )
}

const CartIdPixel = () => {
  const { orderForm, loading }: OrderFormContext = useOrderForm()

  const orderFormId = !loading && orderForm ? orderForm.id : undefined
  useCartIdPixel(orderFormId)

  return null
}

const EnhancedMinicart = (props: MinicartProps) => (
  <MinicartContextProvider
    variation={props.variation}
    openOnHover={props.openOnHover}
  >
    <CartIdPixel />
    <Minicart {...props} />
  </MinicartContextProvider>
)

EnhancedMinicart.defaultProps = {
  quantityDisplay: 'not-empty',
}

export default EnhancedMinicart
