import React, { FC } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCssHandles } from 'vtex.css-handles'

import MinicartIconButton from './components/MinicartIconButton'
import DrawerMode from './components/DrawerMode'

import { MinicartContextProvider, useMinicartState } from './MinicartContext'
import PopupMode from './components/Popup'

interface Props {
  variation: 'popup' | 'drawer' | 'link'
  openOnHover: boolean
  linkVariationUrl: string
  maxDrawerWidth: number | string
  drawerSlideDirection:
    | 'horizontal'
    | 'vertical'
    | 'rightToLeft'
    | 'leftToRight'
}

const CSS_HANDLES = ['minicartWrapperContainer', 'minicartContainer'] as const

const Minicart: FC<Props> = ({
  maxDrawerWidth = 400,
  drawerSlideDirection = 'rightToLeft',
  linkVariationUrl = '/checkout/#/cart',
  children,
}) => {
  const {
    orderForm,
  }: { loading: boolean; orderForm: OrderForm } = useOrderForm()
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

const EnhanedMinicart = (props: Props) => (
  <MinicartContextProvider
    variation={props.variation}
    openOnHover={props.openOnHover}
  >
    <Minicart {...props} />
  </MinicartContextProvider>
)

export default EnhanedMinicart
