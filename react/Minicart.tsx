import React, { FC } from 'react'
import { IconCart } from 'vtex.store-icons'
import { BackdropMode } from 'vtex.store-drawer'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { ResponsiveValuesTypes } from 'vtex.responsive-values'
import { useCheckoutURL } from 'vtex.checkout-resources/Utils'
import { PixelEventTypes } from 'vtex.pixel-manager'
import { useCssHandles, CssHandlesTypes } from 'vtex.css-handles'

import PopupMode from './components/Popup'
import DrawerMode from './components/DrawerMode'
import useCartIdPixel from './modules/useCartIdPixel'
import MinicartIconButton from './components/MinicartIconButton'
import { MinicartContextProvider, useMinicartState } from './MinicartContext'

const CSS_HANDLES = ['minicartWrapperContainer', 'minicartContainer'] as const

interface MinicartProps {
  variation: MinicartVariationType
  openOnHover: boolean
  linkVariationUrl: string
  maxDrawerWidth: number | string
  MinicartIcon: React.ComponentType
  drawerSlideDirection: SlideDirectionType
  quantityDisplay: QuantityDisplayType
  itemCountMode: MinicartTotalItemsType
  backdropMode: ResponsiveValuesTypes.ResponsiveValue<BackdropMode>
  customPixelEventId: string
  customPixelEventName: PixelEventTypes.EventName
  classes: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

const Minicart: FC<Partial<MinicartProps>> = ({
  children,
  backdropMode,
  linkVariationUrl,
  maxDrawerWidth = 400,
  MinicartIcon = IconCart,
  quantityDisplay = 'not-empty',
  itemCountMode = 'distinct',
  drawerSlideDirection = 'rightToLeft',
  customPixelEventId,
  customPixelEventName,
  classes,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES, { classes })
  const { variation } = useMinicartState()
  const { url: checkoutUrl } = useCheckoutURL()

  if (variation === 'link') {
    return (
      <aside
        className={`${handles.minicartWrapperContainer} relative fr flex items-center`}
      >
        <div className={`${handles.minicartContainer} flex flex-column`}>
          <a href={linkVariationUrl ?? checkoutUrl}>
            <MinicartIconButton
              Icon={MinicartIcon}
              itemCountMode={itemCountMode}
              quantityDisplay={quantityDisplay}
            />
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
            Icon={MinicartIcon}
            backdropMode={backdropMode}
            itemCountMode={itemCountMode}
            maxDrawerWidth={maxDrawerWidth}
            quantityDisplay={quantityDisplay}
            drawerSlideDirection={drawerSlideDirection}
            customPixelEventId={customPixelEventId}
            customPixelEventName={customPixelEventName}
          >
            {children}
          </DrawerMode>
        ) : (
          <PopupMode
            Icon={MinicartIcon}
            itemCountMode={itemCountMode}
            quantityDisplay={quantityDisplay}
            customPixelEventId={customPixelEventId}
            customPixelEventName={customPixelEventName}
          >
            {children}
          </PopupMode>
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

export default EnhancedMinicart
