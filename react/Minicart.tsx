import React, { useState, Fragment, FC, createContext, useRef } from 'react'
import { ButtonWithIcon } from 'vtex.styleguide'
import { IconCart } from 'vtex.store-icons'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useDevice } from 'vtex.device-detector'
import { useCssHandles } from 'vtex.css-handles'
import { Drawer } from 'vtex.store-drawer'

import Popup from './Popup'
import useHovering from './hooks/useHover'

const CSS_HANDLES = [
  'minicartWrapperContainer',
  'minicartContent',
  'minicartSideBarContentWrapper',
  'minicartContainer',
  'minicartIconContainer',
  'minicartQuantityBadge',
  'minicartFooter',
  'minicartEmptyStateText',
  'minicartEmptyStateContainer',
] as const

interface Props {
  variation: 'popup' | 'drawer' | 'link'
  linkUrl: string
  maxDrawerWidth: number | string
  drawerSlideDirection:
    | 'horizontal'
    | 'vertical'
    | 'rightToLeft'
    | 'leftToRight'
}

const DRAWER_CLOSE_ICON_HEIGHT = 57

export const MinicartTypeContext = createContext<
  { isSideBar: boolean } | undefined
>(undefined)

const Minicart: FC<Props> = ({
  variation = 'popup',
  maxDrawerWidth = 400,
  drawerSlideDirection = 'rightToLeft',
  linkUrl = '/checkout/#/cart',
  children,
}) => {
  const {
    orderForm,
    loading,
  }: { loading: boolean; orderForm: OrderForm } = useOrderForm()
  const [isOpen, setIsOpen] = useState(false)
  const handles = useCssHandles(CSS_HANDLES)
  const { isMobile } = useDevice()
  const minicartIconRef = useRef<HTMLDivElement>(null)

  const { isHovering } = useHovering(minicartIconRef)

  if (!orderForm) {
    return null
  }

  const itemQuantity = loading ? 0 : orderForm.items.length

  const isDrawerMode = Boolean(
    variation === 'drawer' || isMobile || (window && window.innerWidth <= 480)
  )
  const isLinkMode = variation === 'link'

  const MinicartIconButton = (
    <ButtonWithIcon
      icon={
        <span
          ref={minicartIconRef}
          className={`${handles.minicartIconContainer} gray relative`}
        >
          <IconCart />
          {itemQuantity > 0 && (
            <span
              data-testid="item-qty"
              style={{
                top: '-0.7rem',
                right: '-0.8rem',
              }}
              className={`${handles.minicartQuantityBadge} c-on-emphasis absolute t-mini bg-emphasis br4 w1 h1 pa1 flex justify-center items-center lh-solid`}
            >
              {itemQuantity}
            </span>
          )}
        </span>
      }
      variation="tertiary"
      onClick={() => setIsOpen(!isOpen)}
    />
  )

  const DrawerMode = (
    <Drawer
      maxWidth={maxDrawerWidth}
      slideDirection={drawerSlideDirection}
      customIcon={MinicartIconButton}
    >
      <div
        className={`${handles.minicartSideBarContentWrapper} w-100 h-100 ph4`}
        style={{
          height: window.innerHeight - DRAWER_CLOSE_ICON_HEIGHT,
        }}
      >
        {children}
      </div>
    </Drawer>
  )

  const PopupMode = (
    <Fragment>
      {MinicartIconButton}
      {(isOpen || isHovering) && (
        <Popup onOutsideClick={() => setIsOpen(!isOpen)}>{children}</Popup>
      )}
    </Fragment>
  )

  const LinkMode = <a href={linkUrl}>{MinicartIconButton}</a>

  return (
    <MinicartTypeContext.Provider value={{ isSideBar: isDrawerMode }}>
      <aside
        className={`${handles.minicartWrapperContainer} relative fr flex items-center`}
      >
        <div className={`${handles.minicartContainer} flex flex-column`}>
          {isLinkMode ? LinkMode : isDrawerMode ? DrawerMode : PopupMode}
        </div>
      </aside>
    </MinicartTypeContext.Provider>
  )
}

export default Minicart
