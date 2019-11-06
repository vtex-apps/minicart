import React, { useState, Fragment, FC, createContext } from 'react'
import { ButtonWithIcon } from 'vtex.styleguide'
import { IconCart } from 'vtex.store-icons'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useDevice } from 'vtex.device-detector'
import { useCssHandles } from 'vtex.css-handles'
import { Drawer } from 'vtex.store-drawer'

import Popup from './Popup'

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
  type: 'popup' | 'sidebar'
  maxSidebarWidth: number | string
}

const DRAWER_CLOSE_ICON_HEIGHT = 57

export const MinicartTypeContext = createContext<
  { isSideBar: boolean } | undefined
>(undefined)

const Minicart: FC<Props> = ({
  type = 'sidebar',
  maxSidebarWidth = 400,
  children,
}) => {
  const {
    orderForm,
    loading,
  }: { loading: boolean; orderForm: OrderForm } = useOrderForm()
  const [isOpen, setIsOpen] = useState(false)
  const handles = useCssHandles(CSS_HANDLES)
  const { isMobile } = useDevice()

  if (loading) {
    return null
  }

  const itemQuantity = orderForm.items.length

  const isSideBarMode = Boolean(
    type === 'sidebar' || isMobile || (window && window.innerWidth <= 480)
  )

  const MinicartIconButton = (
    <ButtonWithIcon
      icon={
        <span className={`${handles.minicartIconContainer} gray relative`}>
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

  return (
    <MinicartTypeContext.Provider value={{ isSideBar: isSideBarMode }}>
      <aside
        className={`${handles.minicartWrapperContainer} relative fr flex items-center`}
      >
        <div className={`${handles.minicartContainer} flex flex-column`}>
          {isSideBarMode ? (
            <Drawer
              maxWidth={maxSidebarWidth}
              slideDirection="rightToLeft"
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
          ) : (
            <Fragment>
              {MinicartIconButton}
              {isOpen && (
                <Popup onOutsideClick={() => setIsOpen(!isOpen)}>
                  {children}
                </Popup>
              )}
            </Fragment>
          )}
        </div>
      </aside>
    </MinicartTypeContext.Provider>
  )
}

export default Minicart
